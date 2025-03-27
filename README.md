# Adobe Commerce Out-of-Process ShipStation Shipping Method

Welcome to the ShipStation Shipping Method for Adobe Commerce using Adobe Developer App Builder.  
This project implements an **Out-of-Process Shipping Method** for Adobe Commerce, integrating with the ShipStation API to provide real-time shipping rates. It is built on the official [Adobe Commerce Checkout Starter Kit](https://github.com/adobe/commerce-checkout-starter-kit) and extends it with a production-ready ShipStation integration.

## References

- [Adobe Developer Console documentation](https://developer.adobe.com/developer-console/docs/guides/)
- [App Builder documentation](https://developer.adobe.com/app-builder/docs/overview)
- [Adobe I/O Runtime documentation](https://developer.adobe.com/runtime/docs)
- [Adobe I/O Events documentation](https://developer.adobe.com/events/docs)
- [Adobe Commerce extensibility documentation](https://developer.adobe.com/commerce/extensibility)

## How to Use This Repository

- See [DEVELOPMENT.md](DEVELOPMENT.md) for prerequisites and instructions on setting up and running the project locally.
- See [CICD.md](CICD.md) for details on the CI/CD setup.
- See [EDS.md](EDS.md) for information about integrating with an Edge Delivery Service (EDS) Storefront.

## Getting Started

To begin using the Adobe Commerce ShipStation Shipping Method, ensure your Adobe Commerce environment meets the prerequisites below and follow the installation and configuration steps.

## Prerequisites

You must have the following components installed or accessible in your development environment:

- **Adobe Commerce** version `2.4.4` or higher
- **Node.js** version `22`

  If you are using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm), run:

  ```  $bash
  nvm install 22 && nvm use
  ```

- **Adobe I/O CLI**
- Access to the **Adobe Developer Console** with an **App Builder license**

  If you don’t have access, refer to the official guide to [get access to App Builder](https://developer.adobe.com/app-builder/docs/overview/getting-access/).

## Required Magento Modules

Ensure your Adobe Commerce instance has the following modules installed:

### Out-of-Process Shipping Extensions (OOPE)

This enables support for out-of-process shipping methods.

```  $bash
composer require magento/module-out-of-process-shipping-methods --with-dependencies
 ```

### Out-of-Process Payment Extensions (Optional, for payment methods)

```  $bash
composer require magento/module-out-of-process-payment-methods --with-dependencies
  ```

### Commerce Eventing Module

Required for event handling (only for Adobe Commerce 2.4.4 or 2.4.5):

``  $bash
composer update magento/commerce-eventing --with-dependencies
  ```

To verify the version installed:

``  $bash
composer show magento/commerce-eventing
  ```

For manual installation of the Adobe I/O Events module, refer to: [Adobe I/O Events Installation](https://developer.adobe.com/app-builder/docs/guides/events/overview/).

## Installation & Configuration

Follow these steps to set up your local project and deploy the app:

1. **Create a folder for your project and navigate to it:**

   ```  $bash
   mkdir aio-commerce-shipstation && cd aio-commerce-shipstation
     ```

2. **Initialize the App Builder project:**

   ```  $bash
   aio app init --repo adobe/commerce-checkout-starter-kit --github-pat $GITHUB_PAT
     ```

   > Replace `$GITHUB_PAT` with your GitHub personal access token. For more information, see [Managing Your Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

3. **Add required Adobe I/O services:**

   ```  $bash
   aio app add service
     ```

   Select the following services when prompted:

   - I/O Management API
   - I/O Events
   - Adobe I/O Events for Adobe Commerce

4. **Set up environment variables:**

   Copy `env.dist` to `.env` and fill in the required values:

   ```  $bash
   cp env.dist .env
     ```

   Add the following environment variables to your `.env` file:

   ```  $bash
   # Adobe Commerce OAuth Configuration (replace with your own credentials)
   COMMERCE_BASE_URL=https://your-commerce-base-url
   OAUTH_CLIENT_ID=your-oauth-client-id
   OAUTH_CLIENT_SECRETS=["your-oauth-client-secret"]
   OAUTH_TECHNICAL_ACCOUNT_ID=your-technical-account-id@techacct.adobe.com
   OAUTH_TECHNICAL_ACCOUNT_EMAIL=your-technical-account-email@techacct.adobe.com
   OAUTH_SCOPES=["AdobeID, openid, read_organizations, additional_info.projectedProductContext, additional_info.roles, adobeio_api, read_client_secret, manage_client_secrets, event_receiver_api"]
   OAUTH_IMS_ORG_ID=your-ims-org-id@AdobeOrg

   # ShipStation API credentials
   SHIPSTATION_API_KEY=your-shipstation-api-key
   SHIPSTATION_CARRIER_IDS=carrier-id-1,carrier-id-2

   # Warehouse (ship_from) data
   SHIPSTATION_WAREHOUSE_NAME=Your Warehouse Name
   SHIPSTATION_WAREHOUSE_PHONE=999-999-9999
   SHIPSTATION_WAREHOUSE_ADDRESS_LINE1=123 Warehouse St
   SHIPSTATION_WAREHOUSE_CITY=Your City
   SHIPSTATION_WAREHOUSE_REGION=ST
   SHIPSTATION_WAREHOUSE_POSTCODE=12345
   SHIPSTATION_WAREHOUSE_COUNTRY=US

   # Ship-to default data (optional)
   SHIPSTATION_SHIPTO_NAME=Default Customer Name
   SHIPSTATION_SHIPTO_PHONE=888-888-8888

   # Enable debugging (optional)
   SHIPSTATION_DEBUGGING=true
     ```

   ### Environment Variable Details

    - **Adobe Commerce OAuth Variables**: Obtain these from your Adobe Developer Console project for authenticating with Adobe Commerce.
    - **`SHIPSTATION_API_KEY`**: Your ShipStation API key, available from your ShipStation account.
    - **`SHIPSTATION_CARRIER_IDS`**: Comma-separated list of carrier IDs (e.g., `se-2196880`) from ShipStation that you want to use for shipping rates.
    - **Warehouse Fields**: Define the "ship from" address (e.g., your store’s warehouse). Replace with your actual warehouse details.
    - **Ship-to Fields**: Optional default values for the "ship to" name and phone. These can be overridden by customer data during checkout.
    - **`SHIPSTATION_DEBUGGING`**: Set to `true` to enable detailed error logging for troubleshooting.

5. **Deploy the app:**

   Deploy your app to Adobe I/O Runtime using:

   ```  $bash
   aio app deploy
     ```

   After deployment, note the URL of your deployed app (e.g., `https://your-namespace-your-app-name.adobeioruntime.net/api/v1/web/your-action`). You’ll need this for the webhook configuration.

## Configure Adobe Commerce

After deploying your app, configure Adobe Commerce to use the ShipStation shipping method.

### Create Shipping Carriers

Run the following script to create the ShipStation shipping carrier in Adobe Commerce:

```  $bash
npm run create-shipping-carriers
  ```

This script registers the ShipStation shipping method in your Adobe Commerce instance using the OAuth credentials provided in your `.env` file.

### Configure Webhooks

In your Adobe Commerce module or project, add or update the `webhooks.xml` file to integrate with your deployed app. Create or edit `app/code/Vendor/Module/etc/webhooks.xml` with the following content:

```  $xml
<?xml version="1.0" encoding="UTF-8"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_AdobeCommerceWebhooks:etc/webhooks.xsd">
    <method name="plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates" type="after">
        <hooks>
            <batch name="shipping_methods">
                <hook name="oope_shipping_methods_carrier_one"
                      url="https://your-deployed-app-url"
                      method="POST"
                      required="true"
                      fallbackErrorMessage="Unable to retrieve ShipStation shipping rates.">
                    <fields>
                        <field name="rateRequest" source="rateRequest" />
                    </fields>
                </hook>
            </batch>
        </hooks>
    </method>
</config>
  ```

Replace `https://your-deployed-app-url` with the actual URL of your deployed app from the `aio app deploy` step.

After updating `webhooks.xml`, run the following commands to apply the changes:

``` $bash
bin/magento setup:upgrade
bin/magento cache:flush
 ```

## Integrate with EDS Storefront

You can integrate your Out-of-Process Shipping Extension (OOPE) — powered by ShipStation — with an Edge Delivery Services (EDS) Storefront. This enables real-time shipping rates to be displayed in a headless storefront.

### Prerequisites

Before integrating, ensure the following:
- Your EDS Storefront is integrated with Adobe Commerce.
- The Storefront is configured to use the **Checkout Drop-in Component**.

> The Drop-in Component allows customers to enter shipping details, view available shipping methods (including ShipStation rates), and complete their order in a seamless UI block.

### For Full Integration Instructions

See the [DROPINS.md](https://github.com/BlueAcornInc/showcase-evergreen-commerce-storefront/blob/main/DROPINS.md) file in the EDS Storefront repository for a complete walkthrough. This guide covers:
- Fetching and displaying ShipStation shipping rates.
- Handling shipping method selection.
- Integrating with the checkout flow in Adobe Commerce.
- Best practices for performance and extensibility.">
