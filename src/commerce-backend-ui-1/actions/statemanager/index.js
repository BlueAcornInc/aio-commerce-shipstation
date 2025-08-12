const libState = require("@adobe/aio-lib-state");
const { Core } = require("@adobe/aio-sdk");

/**
 * Main action for state management
 * @param {object} params Action input parameters
 * @returns {Promise<object>} Response object
 */
async function main(params) {
  const logger = Core.Logger("statemanager", { level: "info" });
  const state = await libState.init();

  try {
    if (params.__ow_method === "get") {
      let content = null;
      if (params.path !== undefined && params.path !== "") {
        content = await state.get(params.path);
      } else {
        content = {};
        for await (const key of state.list()) {
          logger.info(
            `Fetching state for key: ${JSON.stringify(key)} (type: ${typeof key})`,
          );
          content[key] = await state.get(key);
        }
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      };
    } else if (params.__ow_method === "post") {
      // Handle POST request
      const config = params.payload;
      await state.put(params.path, JSON.stringify(config), {
        ttl: 36000,
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Configuration saved successfully" }),
      };
    } else {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }
  } catch (error) {
    logger.error("Error in statemanager action:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

exports.main = main;
