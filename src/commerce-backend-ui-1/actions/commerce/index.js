// src/commerce-backend-ui-1/actions/shipstation-config/index.js
const { Core } = require("@adobe/aio-sdk");
const stateLib = require("@adobe/aio-lib-state");
const { MAX_TTL } = stateLib; // Import MAX_TTL constant

async function main(params) {
    const logger = Core.Logger("shipstation-config", { level: "info" });

    try {
        const state = await stateLib.init();

        if (params.__ow_method === "post") {
            const body = JSON.parse(params.__ow_body || "{}");
            if (Object.keys(body).length === 0) {
                throw new Error("No configuration data provided");
            }

            await state.put("shipStationConfig", JSON.stringify(body), {
                ttl: MAX_TTL,
            });
            logger.info("Saved config", body);

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true, message: "Configuration saved" }),
            };
        } else {
            const entry = await state.get("shipStationConfig");
            const config = entry ? entry.value : null;
            logger.info("Loaded config", config);

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: config || JSON.stringify({ message: "No configuration found" }),
            };
        }
    } catch (error) {
        logger.error("Error processing request", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
}

exports.main = main;
