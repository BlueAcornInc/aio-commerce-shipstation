const { Core } = require("@adobe/aio-sdk");
const {
  readConfiguration,
  writeConfiguration,
} = require("../../../shared/configurationHelper");

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
    const {
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
    } = params.payload;

    if (!shipstationApiKey || !shipstationCarrierIds) {
      logger.error("Missing field for request", params);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            "Missing required fields (shipstationApiKey, shipstationCarrierIds).",
          receivedParams: params,
        }),
      };
    }

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
          savedConfig: configToStore,
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
          error: error || "Unknown error",
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
          config: loadedConfig,
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
          error: error || "Unknown error",
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
