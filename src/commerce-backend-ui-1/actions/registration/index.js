// src/commerce-backend-ui-1/actions/registration/index.js
async function main(params) {
  params;
  const namespace = process.env.__OW_NAMESPACE || "default-namespace";
  const baseUrl = `https://${namespace}.adobeio-static.net`;
  const href = `${baseUrl}/index.html`;
  return {
    statusCode: 200,
    body: {
      registration: {
        name: "shipstation-extension",
        title: "ShipStation Extension",
        description:
          "ShipStation out-of-process shipping integration for Adobe Commerce",
        icon: "none",
        publisher: "PUBLISHER_ID",
        status: "PUBLISHED",

        endpoints: {
          "commerce/backend-ui/1": {
            view: [
              {
                href: href,
              },
            ],
          },
        },

        xrInfo: {
          supportEmail: "extensions@blueacorn.com",
          appId: "APP_ID",
        },
      },
    },
  };
}

exports.main = main;
