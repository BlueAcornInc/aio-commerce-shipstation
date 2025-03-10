// src/app/actions/shipstation-config/index.js
const { Core } = require("@adobe/aio-sdk");
const stateLib = require("@adobe/aio-lib-state");

// Import the MAX_TTL constant
const { MAX_TTL } = stateLib;

async function main(params) {
  const logger = Core.Logger("shipstation-config", { level: "info" });

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
    } = params;

    if (!shipstationApiKey || !shipstationCarrierIds) {
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

    // Save to aio-lib-state with MAX_TTL
    const state = await stateLib.init();
    await state.put("shipstationConfig", JSON.stringify(configToStore), {
      ttl: MAX_TTL,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Saved ShipStation config with max TTL",
        savedConfig: configToStore,
      }),
    };
  } else if (params.__ow_method === "get") {
    const state = await stateLib.init();
    const entry = await state.get("shipstationConfig");
    let loadedConfig = {};
    if (entry && entry.value) {
      try {
        loadedConfig = JSON.parse(entry.value);
      } catch (e) {
        logger.warn("Failed to parse stored JSON", e);
        loadedConfig = {};
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Loaded ShipStation config",
        config: loadedConfig,
      }),
    };
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
