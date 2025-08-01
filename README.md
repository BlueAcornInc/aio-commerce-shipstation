# ShipStation by Blue Acorn

This Adobe App Builder extension provides a secure and efficient way for Adobe Commerce merchants to store and consume their ShipStation credentials. All configurations, including sensitive credentials, are managed directly within the Adobe Commerce Admin backend. The App Builder application securely retrieves these settings and makes them available to your storefront via API, enabling order fulfillment, shipping label generation, and integration with ShipStation services.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Downloading the latest release](#downloading-the-latest-release)
- [Configuration (Adobe Commerce Backend)](#configuration-adobe-commerce-backend)
- [Environment Variables (App Builder Operational)](#environment-variables-app-builder-operational)
- [Usage](#usage)
- [Development](#development)
- [Support](#support)
- [Contributing](#contributing)

---

## Features

- **Secure Credential Storage:** ShipStation credentials are stored securely encrypted in Adobe I/O file system
- **Frontend/Backend API Access:** The App Builder application exposes secure API endpoints for the backend to retrieve necessary ShipStation credentials and configuration, enabling interaction with ShipStation services (e.g., order syncing, label creation).
- **Centralized Configuration:** All ShipStation-specific settings are managed by the merchant directly within the familiar Adobe Commerce Admin Panel UI.
- **Easy Integration:** Designed for quick and straightforward deployment as an App Builder application.
- **Adobe App Builder Powered:** Leveraging the power and scalability of Adobe App Builder for reliable performance and easy deployment.

---

## Requirements

Before installing this extension, ensure you have the following:

- **Adobe Commerce (Cloud, SaaS or On-Premise):** Version 2.4.5 or higher.

- **Adobe Developer App Builder Project:** An active App Builder project configured for your Adobe Commerce instance's organization.

- **ShipStation Account:** A valid ShipStation account with API access credentials (API Key and API Secret).

- **Node.js and npm/yarn:** For local development and testing of the App Builder application, Node.js version 22 or higher is required.

- **Adobe I/O CLI:** For deploying App Builder actions. [See installation guide](https://developer.adobe.com/app-builder/docs/guides/runtime_guides/tools/cli-install).

- **AppBuilder license**: Access to the [Adobe Developer Console](https://console.adobe.io/) with an App Builder license.

- **IMS Authentication:** Ensure IMS (Identity Management System) authentication is configured and working on your Adobe Commerce instance.

- **Install Adobe Commerce Modules (PaaS only)**
  - Install the required modules for the ShipStation extension:

    ```bash
    composer require magento/module-out-of-process-shipping-methods --with-dependencies
    ```

  - For Commerce Webhooks, refer to the [Install Adobe Commerce Webhooks](https://developer.adobe.com/commerce/extensibility/webhooks/installation/).

  - Complete the [Admin UI SDK installation process](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/installation/) and install version `3.0.0` or higher:

    ```bash
    composer require "magento/commerce-backend-sdk": ">=3.0"
    ```

## Installation

You can install this extension either by downloading it directly from the repository or from the Adobe Exchange marketplace.

### Downloading the latest release

1.  **Download the Extension:** Get the latest release package from the [release page](https://github.com/BlueAcornInc/aio-commerce-shipstation/releases).

1.  **Extract the Files:** Unzip the downloaded package from git to your preferred development directory. This directory contains the Shipstation Adobe App Builder project.

1.  **Install the packages by running following command:** `npm install`

1.  Copy the environment variables from the env.dist to a local .env file. We will complete the required variables in the upcoming sections.

1.  **Configure App Builder Project**
    - **Create an App Builder project in Developer Console**
      1. Log in to the [Adobe Developer Console](https://console.adobe.io/) and select the desired organization from the dropdown menu in the top-right corner.

      1. Click **Create new project from template**.

      1. Select **App Builder**. The **Set up templated project** page displays.

      1. Specify a project title and app name. Mark the **Include Runtime with each workspace** checkbox.

    - **Initialize App Builder project**
      1.  Navigate to the downloaded code and run:

          ```bash
          aio login
          aio console org select
          aio console project select
          aio console workspace select
          aio app use --merge
          ```

      1.  Add required services to your project:

          ```bash
          aio app add service
          ```

          Select the following from the list:
          - I/O Management API
          - (If connecting to Adobe Commerce as a Cloud Service) Adobe Commerce as a Cloud Service

      1.  Run the following command to populate the relevant `.env` values:

          ```bash
          npm run sync-oauth-credentials
          ```

          This will generate entries:

          ```env
          # IMS OAuth Server-to-Server Credentials
          OAUTH_CLIENT_ID=
          OAUTH_CLIENT_SECRETS=[""]
          OAUTH_TECHNICAL_ACCOUNT_ID=
          OAUTH_TECHNICAL_ACCOUNT_EMAIL=
          OAUTH_SCOPES=[""]
          OAUTH_IMS_ORG_ID=
          ```
      - If the credential is empty, make sure you have added the `I/O Management API` and your `.env` is synced with the Developer Console Project.

1.  **Create a Commerce integration (PaaS only)**
    1. Create a new Adobe Commerce Integration by following the [systems integration](https://experienceleague.adobe.com/en/docs/commerce-admin/systems/integrations) guide.

    1. Make sure your API integration has the necessary permissions to access the Commerce REST API.

       To confirm that you have access, in the Commerce Admin, navigate to **System** > **Extensions** > **Integrations**. Under the Basic Settings menu, click **API** to view the Available APIs. Then select **All** in the **Resource Access** field.

    1. Copy the integration details (consumer key, consumer secret, access token, and access token secret) to the `.env` file in the root of the project.

       ```env
       COMMERCE_CONSUMER_KEY=<key>
       COMMERCE_CONSUMER_SECRET=<secret>
       COMMERCE_ACCESS_TOKEN=<access token>
       COMMERCE_ACCESS_TOKEN_SECRET=<access token secret>
       ```

1.  **Configure Shipping Method:**

    Create a shipping method defined in `shipping-carriers.yaml`:

    ```bash
        npm run create-shipping-carriers
    ```

1.  **Update Operational Environment Variables:**  
     Before deploying, set the necessary environment variables for your App Builder actions as described in the [Environment Variables (App Builder Operational)](#environment-variables-app-builder-operational) section. These are critical for the App Builder app's ability to communicate with Adobe Commerce and perform internal encryption.

1.  **Deploy App Builder Actions:**
    - Deploy the App Builder actions using the Adobe I/O CLI:

      ```bash
      aio app deploy
      ```

1.  **Configure ShipStation Settings in Adobe Commerce Backend:** After deploying the App Builder app, you **must** configure your ShipStation settings in your Adobe Commerce Admin panel as described in the [Configuration (Adobe Commerce Backend)](#configuration-adobe-commerce-backend) section.

---

## Configuration (Adobe Commerce Backend)

All ShipStation-specific configurations for this extension are managed by the merchant directly within the **Adobe Commerce Admin Panel**. The deployed Adobe App Builder application will then retrieve these settings at runtime via secure API calls to your Adobe Commerce instance.

1.  **Access ShipStation Configuration in Adobe Commerce:**
    - Log in to your Adobe Commerce Admin Panel.
    - Navigate to **ShipStation \> General Settings** in the left-hand navigation menu.
2.  **Configure ShipStation Settings:** Fill in the following details using information provided by ShipStation:
    - **Enable/Disable ShipStation Extension:** Select Yes or No to activate or deactivate the integration's functionality.
    - **ShipStation API Key:** Your ShipStation API Key.
    - **Carrier IDs:** (Required) Provide a comma-separated list of the carrier IDs you want to use (e.g., `se-12345,se-67890`).
    - **Warehouse Name:** The name of your origin warehouse.
    - **Warehouse Phone:** The phone number for the origin warehouse.
    - **Warehouse Address:** The street address line for the origin warehouse.
    - **Warehouse City:** The city for the origin warehouse.
    - **Warehouse State/Province:** The state or province for the origin warehouse (e.g., TX, QC).
    - **Warehouse Postcode:** The postal or ZIP code for the origin warehouse.
    - **Warehouse Country:** The country for the origin warehouse (e.g., US, CA).
    - **Ship-To Name (optional):** A default name for the recipient if one isn't provided by the order.
    - **Ship-To Phone (optional):** A default phone number for the recipient.
3.  **Save Configuration:** Click "**Save Config**" to apply your changes in Adobe Commerce.
4.  **Verify Functionality:** After configuration, test your integration to ensure the App Builder app is correctly retrieving and utilizing the ShipStation settings for order syncing and fulfillment.

### Configure Webhooks

#### Prepare Webhook Signature

1. In Adobe Commerce, go to **Stores > Settings > Configuration > Adobe Services > Webhooks**
1. Enable **Digital Signature Configuration** and click **Regenerate Key Pair**
1. Add the generated **Public Key** to your `.env` as [the same format](https://developer.adobe.com/commerce/extensibility/webhooks/signature-verification/#verify-the-signature-in-the-app-builder-action):

   ```env
   COMMERCE_WEBHOOKS_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -----END PUBLIC KEY-----"
   ```

#### Create Webhooks

After deploying your App Builder actions, [create the webhooks](https://developer.adobe.com/commerce/extensibility/webhooks/create-webhooks/) with the following actions:

1.  `shipstation-shipping`: This action gets shipping rates for the cart.
    - **For SaaS:** Register your action to `plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates` webhook method in **System \> Webhooks \> Webhooks Subscriptions**.

    - **For PaaS:** Refer to `webhooks.xml`. Replace the placeholder URL with the actual URL of your deployed action.

      ```xml
      <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_AdobeCommerceWebhooks:etc/webhooks.xsd">
         <method name="plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates" type="after">
             <hooks>
                 <batch name="shipstation">
                     <hook name="add_shipping_rates_shipstation" url="https://<your_app_builder>.runtime.adobe.io/api/v1/web/aio-commerce-shipstation-app/shipstation-shipping" method="POST" timeout="5000" softTimeout="1000" priority="100" required="true">
                         <fields>
                             <field name="rateRequest" />
                         </fields>
                     </hook>
                 </batch>
             </hooks>
         </method>
      </config>
      ```

---

## Environment Variables (App Builder Operational)

These environment variables are crucial for the **operational functioning and security of the Adobe App Builder application itself**. They allow the App Builder to connect to your Adobe Commerce instance and perform internal data protection. These are **not** the ShipStation-specific settings for your store, which are configured in the Adobe Commerce Admin.

For **local development**, these are typically set in your `.env` file within your App Builder project.

- `ENCRYPTION_KEY`
  - **Description:** A 32-byte (64-character hexadecimal string) key used by the App Builder application for internal encryption operations, such as protecting sensitive configuration data retrieved from Adobe Commerce before processing or transmitting to the frontend.

  - **How to Generate:** You can generate a secure key using `openssl`:

    ```bash
    openssl rand -hex 32
    ```

  - **Example `.env` entry:**

    ```
    ENCRYPTION_KEY=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
    ```

- `ENCRYPTION_IV`
  - **Description:** A 16-byte (32-character hexadecimal string) Initialization Vector (IV) used in conjunction with the `ENCRYPTION_KEY` for encryption.

  - **How to Generate:** You can generate a secure IV using `openssl`:

    ```bash
    openssl rand -hex 16
    ```

  - **Example `.env` entry:**

    ```
    ENCRYPTION_IV=f1e2d3c4b5a69876543210fedcba9876
    ```

- `COMMERCE_BASE_URL`
  - **Description:** The base URL of your Adobe Commerce instance's API (e.g., `https://your-magento-store.com/graphql` or `https://your-magento-store.com/rest/V1`). The App Builder action will use this to securely retrieve the ShipStation configuration settings from your Commerce backend.

  - **Type:** String

  - **Example `.env` entry:**

    ```
    COMMERCE_BASE_URL=https://your-magento-store.com/graphql
    ```

- `COMMERCE_WEBHOOKS_PUBLIC_KEY`
  - **Description:** The public key generated in the Commerce Admin to verify webhook signatures.

**Example `.env` file structure:**

```env
# This file must not be committed to source control
# Internal Encryption
ENCRYPTION_KEY=...
ENCRYPTION_IV=...

# Adobe Commerce Connection
COMMERCE_BASE_URL=https://mystore.com/rest/all
COMMERCE_WEBHOOKS_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."

# IMS OAuth Server-to-Server Credentials
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRETS=...
OAUTH_TECHNICAL_ACCOUNT_ID=...
OAUTH_TECHNICAL_ACCOUNT_EMAIL=...
OAUTH_SCOPES=Adobe_Commerce_API
OAUTH_IMS_ORG_ID=...

#Commerce Integrations (PaaS Only)
COMMERCE_CONSUMER_KEY=
COMMERCE_CONSUMER_SECRET=
COMMERCE_ACCESS_TOKEN=
COMMERCE_ACCESS_TOKEN_SECRET=
```

## Usage

Once the App Builder application is deployed and configured, ShipStation will be available as a shipping method during the checkout process in Adobe Commerce, using the rates and logic defined in your actions.

---

## Development

For detailed instructions on setting up your development environment, testing, and contributing to this App Builder extension, please refer to our dedicated development guide.

[**`DEVELOPMENT.md`**](DEVELOPMENT.md)

---

## Support

For any issues, questions, or feature requests, please refer to the following:

- **Issue Tracker:** [Github Issues](https://github.com/BlueAcornInc/aio-commerce-shipstation/issues)
- **Contact:** [apps@blueacornici.com](mailto:apps@blueacornici.com)

---

## Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to our coding standards.
4.  Write clear and concise commit messages.
5.  Submit a pull request.
