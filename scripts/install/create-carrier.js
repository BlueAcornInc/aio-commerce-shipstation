/*
 * App Management installation step: creates the ShipStation out-of-process
 * shipping carrier in the associated Commerce instance, and removes it again
 * on uninstall. Replaces the manual scripts/create-shipping-carriers.js run.
 */
import { getCommerceClient } from "@adobe/aio-commerce-lib-app";
import { defineCustomInstallationStep } from "@adobe/aio-commerce-lib-app/management";
import { resolveImsAuthParams } from "@adobe/aio-commerce-lib-auth";

export const CARRIER = {
  code: "ShipStation",
  title: "ShipStation Shipping",
  stores: ["default"],
  countries: ["US"],
  active: true,
  sort_order: 10,
  tracking_available: true,
  shipping_labels_available: true,
};

const client = (params) => getCommerceClient(resolveImsAuthParams(params));

export default defineCustomInstallationStep({
  install: async (_config, { params, logger }) => {
    const commerce = await client(params);
    await commerce.post("oope_shipping_carrier", {
      json: { carrier: CARRIER },
    });
    logger.info(`Created shipping carrier ${CARRIER.code}`);
    return { status: "success", message: `Created carrier ${CARRIER.code}` };
  },
  uninstall: async (_config, { params, logger }) => {
    const commerce = await client(params);
    try {
      await commerce.delete(`oope_shipping_carrier/${CARRIER.code}`);
      logger.info(`Removed shipping carrier ${CARRIER.code}`);
    } catch (error) {
      // Already gone (removed by hand, say) is fine on uninstall.
      if (error?.response?.status !== 404) throw error;
    }
    return { status: "success", message: `Removed carrier ${CARRIER.code}` };
  },
});
