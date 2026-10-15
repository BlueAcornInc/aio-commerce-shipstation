const { Core } = require("@adobe/aio-sdk");
const {
  readConfiguration,
  writeConfiguration,
} = require("../../../shared/configurationHelper");

const REQUIRED_FIELDS = ["shipstationCarrierIds"];

/**
 * The configuration the admin UI may see. The ShipStation API key is
 * write-only: it is never returned, only reported as present or absent.
 *
 * @param {object} config Stored configuration
 * @returns {object} Configuration safe to return to the browser
 */
function toAdminConfig(config = {}) {
  const { shipstationApiKey, ...rest } = config;
  return { ...rest, hasShipstationApiKey: Boolean(shipstationApiKey) };
}

/**
 * Read the stored API key, if any, so a save without a new key keeps it.
 *
 * @param {object} params Action params
 * @param {string} name Configuration name
 * @returns {Promise<string|undefined>} The stored key, or undefined
 */
async function readStoredApiKey(params, name) {
  try {
    const existing = await readConfiguration(params, name);
    return existing?.shipstationApiKey;
  } catch {
    return undefined;
  }
}

/**
 * Main admin action
 *
 * @param {object} params Action input param
 * @returns {object} Response object
 */
async function main(params) {
  const logger = Core.Logger("shipstation-config", { level: "info" });
  const name = "shipstation";

  // Check the method
  if (params.__ow_method === "post") {
    const payload = params.payload || {};
    // Write-only key: a blank value keeps the stored one.
    const shipstationApiKey =
      payload.shipstationApiKey || (await readStoredApiKey(params, name));
    const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
    if (!shipstationApiKey) missing.unshift("shipstationApiKey");

    if (missing.length > 0) {
      // Field names only: params carries credentials and is never logged.
      logger.warn(`Missing required fields: ${missing.join(", ")}`);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Missing required fields (${missing.join(", ")}).`,
        }),
      };
    }

    const {
      shipstationCarrierIds,
      warehouseName,
      warehousePhone,
      warehouseAddressLine1,
      warehouseCityLocality,
      warehouseStateProvince,
      warehousePostalCode,
      warehouseCountryCode,
      shipToName,
      shipToPhone,
    } = payload;

    const configToStore = {
      shipstationApiKey,
      shipstationCarrierIds,
      warehouseName,
      warehousePhone,
      warehouseAddressLine1,
      warehouseCityLocality,
      warehouseStateProvince,
      warehousePostalCode,
      warehouseCountryCode,
      shipToName,
      shipToPhone,
    };

    try {
      await writeConfiguration(configToStore, name, params);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Saved ShipStation config",
          savedConfig: toAdminConfig(configToStore),
        }),
      };
    } catch (error) {
      logger.error(error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Error while saving configuration",
        }),
      };
    }
  } else if (params.__ow_method === "get") {
    try {
      const loadedConfig = await readConfiguration(params, name);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Loaded ShipStation config",
          config: toAdminConfig(loadedConfig),
        }),
      };
    } catch (error) {
      logger.error(error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          message: "Error while loading configuration",
        }),
      };
    }
  } else {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Method Not Allowed",
        allowedMethods: ["GET", "POST"],
      }),
    };
  }
}

exports.main = main;
