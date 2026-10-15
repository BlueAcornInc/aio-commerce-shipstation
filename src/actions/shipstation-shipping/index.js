/*
 * ShipStation shipping rates: the out-of-process shipping-methods webhook.
 *
 * Commerce calls this during checkout (registered by App Management on
 * install). It verifies the webhook signature, reads the store's App
 * Management configuration (the API key is a decrypted password field), asks
 * ShipStation for rates and returns them as shipping-method operations.
 */
const { Core } = require("@adobe/aio-sdk");
const {
  initialize,
  getConfigurationByKey,
  byStoreViewId,
  byCodeAndLevel,
} = require("@adobe/aio-commerce-lib-config");
const schema = require("../../commerce-configuration-1/.generated/configuration-schema.json");
const { webhookErrorResponse, webhookVerify } = require("../../../lib/webhook");

const FIELDS = [
  "status",
  "shipstationApiKey",
  "shipstationCarrierIds",
  "warehouseName",
  "warehousePhone",
  "warehouseAddressLine1",
  "warehouseCityLocality",
  "warehouseStateProvince",
  "warehousePostalCode",
  "warehouseCountryCode",
  "shipToName",
  "shipToPhone",
];
const REQUIRED_WAREHOUSE = FIELDS.filter((name) =>
  name.startsWith("warehouse"),
);
const DESTINATION = {
  dest_country_id: "country_code",
  dest_postcode: "postal_code",
  dest_region_code: "state_province",
  dest_city: "city_locality",
  dest_street: "address_line1",
};

/**
 * Read the configuration at one scope, decrypting the API key.
 *
 * @param {object} scope Scope selector from lib-config
 * @param {string} encryptionKey AIO_COMMERCE_CONFIG_ENCRYPTION_KEY
 * @returns {Promise<object>} Field values by name
 */
async function readFields(scope, encryptionKey) {
  const values = await Promise.all(
    FIELDS.map(async (name) => {
      const { config } = await getConfigurationByKey(name, scope, {
        encryptionKey,
      });
      return config?.value;
    }),
  );
  return Object.fromEntries(FIELDS.map((name, i) => [name, values[i]]));
}

/**
 * Read the configuration for the rate request's store view, falling back to
 * the global scope when the store view isn't in the scope tree.
 *
 * @param {object} request The rate request
 * @param {string} encryptionKey AIO_COMMERCE_CONFIG_ENCRYPTION_KEY
 * @returns {Promise<object>} Field values by name
 */
async function readConfig(request, encryptionKey) {
  const storeId = Number(request?.store_id);
  const scopes = [
    ...(Number.isInteger(storeId) && storeId > 0
      ? [byStoreViewId(storeId)]
      : []),
    byCodeAndLevel("global", "global"),
  ];
  for (const scope of scopes) {
    try {
      return await readFields(scope, encryptionKey);
    } catch (error) {
      if (!/^INVALID_SCOPE/.test(error.message)) throw error;
    }
  }
  return {};
}

/**
 * One package per item, weighted in pounds (defaulting to 1).
 *
 * @param {object} request The rate request
 * @returns {Array<object>} ShipStation packages
 */
function buildPackages(request) {
  const items = Array.isArray(request?.items) ? request.items : [];
  if (items.length === 0) return [{ weight: { value: 1, unit: "pound" } }];
  return items.map((item) => ({
    weight: { value: Number(item?.weight) || 1, unit: "pound" },
  }));
}

/**
 * Converts ShipStation rates into shipping-method operations.
 *
 * @param {Array<object>} rates ShipStation rates
 * @returns {Array<object>} Webhook operations
 */
function toOperations(rates) {
  const seen = {};
  return rates.map((rate) => {
    const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0;
    const methodCode = rate.service_type || rate.service_code || "unknown";
    let method = rate.service_code || methodCode;
    seen[method] = (seen[method] || 0) + 1;
    if (seen[method] > 1) method = `${method}_${seen[method]}`;
    return {
      op: "add",
      path: "result",
      value: {
        carrier_code: "ShipStation",
        method,
        method_title: methodCode,
        price: cost,
        cost,
        additional_data: [
          {
            key: "shipstation_service",
            value: rate.carrier_friendly_name || rate.carrier_id || "Carrier",
          },
        ],
      },
    };
  });
}

/**
 * @param {object} params Action params (raw-http)
 * @returns {Promise<object>} Webhook response
 */
async function main(params) {
  const logger = Core.Logger("shipstation-shipping", {
    level: params.LOG_LEVEL || "info",
  });

  try {
    const verified = webhookVerify(params);
    if (!verified.success) {
      logger.warn(`Rejected webhook: ${verified.error}`);
      return webhookErrorResponse("Webhook signature could not be verified.");
    }

    let request;
    try {
      request = JSON.parse(
        Buffer.from(params.__ow_body, "base64").toString(),
      )?.rateRequest;
    } catch {
      return webhookErrorResponse("Invalid payload.");
    }
    if (!request) return webhookErrorResponse("Missing rate request.");

    const missingAddress = Object.keys(DESTINATION).filter(
      (key) => !request[key],
    );
    if (missingAddress.length > 0) {
      return webhookErrorResponse("Missing required shipping address fields.");
    }

    await initialize({ schema });
    const config = await readConfig(
      request,
      params.AIO_COMMERCE_CONFIG_ENCRYPTION_KEY,
    );
    if (config.status !== "on") {
      // Off: offer no ShipStation methods, and don't fail checkout.
      return { statusCode: 200, body: JSON.stringify([]) };
    }
    const missingConfig = [
      "shipstationApiKey",
      "shipstationCarrierIds",
      ...REQUIRED_WAREHOUSE,
    ].filter((name) => !config[name]);
    if (missingConfig.length > 0) {
      logger.warn(`Configuration incomplete: ${missingConfig.join(", ")}`);
      return webhookErrorResponse("ShipStation is not fully configured.");
    }

    const shipTo = Object.fromEntries(
      Object.entries(DESTINATION).map(([from, to]) => [to, request[from]]),
    );
    const response = await fetch("https://api.shipstation.com/v2/rates", {
      method: "POST",
      headers: {
        "API-Key": config.shipstationApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment: {
          ship_to: {
            name: config.shipToName || "",
            phone: config.shipToPhone || "",
            ...shipTo,
          },
          ship_from: {
            name: config.warehouseName,
            phone: config.warehousePhone,
            address_line1: config.warehouseAddressLine1,
            city_locality: config.warehouseCityLocality,
            state_province: config.warehouseStateProvince,
            postal_code: config.warehousePostalCode,
            country_code: config.warehouseCountryCode,
          },
          packages: buildPackages(request),
        },
        rate_options: {
          carrier_ids: config.shipstationCarrierIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean),
        },
      }),
    });

    if (!response.ok) {
      // Status only: ShipStation error bodies can echo request details.
      logger.error(`ShipStation API error: HTTP ${response.status}`);
      return webhookErrorResponse("ShipStation API error.");
    }
    const data = await response.json();
    const rates = data.rates || data.rate_response?.rates || [];
    return { statusCode: 200, body: JSON.stringify(toOperations(rates)) };
  } catch (error) {
    // Message only; never the params, which carry credentials.
    logger.error(`ShipStation rates failed: ${error.message}`);
    return webhookErrorResponse("ShipStation rates are unavailable.");
  }
}

module.exports = { main, buildPackages, toOperations };
