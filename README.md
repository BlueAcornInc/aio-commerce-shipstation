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

- **Node.js and npm/yarn:** For local development and testing of the App Builder application, node version 22 or higher is required.

- **Adobe I/O CLI:** For deploying App Builder actions. [See](https://developer.adobe.com/app-builder/docs/guides/runtime_guides/tools/cli-install)

- **AppBuilder license**: Access to the [Adobe Developer Console](https://console.adobe.io/) with an App Builder license.

- **IMS Authentication:** Ensure IMS (Identity Management System) authentication is configured and working on your Adobe Commerce instance, as this is typically used for secure API communication with Adobe services, including App Builder actions.

- **Install Adobe Commerce Modules (PaaS only)**
  - Install the required modules for the ShipStation extension :

    ```bash
    composer require magento/module-out-of-process-shipping-methods --with-dependencies
    ```

  - For Commerce Webhook, refer to the [Install Adobe Commerce Webhooks](https://developer.adobe.com/commerce/extensibility/webhooks/installation/)

  - Complete the [Admin UI SDK installation process](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/installation/) and install version `3.0.0` or higher:

    ```bash
    composer require "magento/commerce-backend-sdk": ">=3.0"
    ```

---

## Installation

You can install this extension either by downloading it directly from the repository or from the Adobe Exchange marketplace.

### Downloading the latest release

1.  **Download the Extension:** Get the latest release package from the [release page](https://github.com/BlueAcornInc/aio-commerce-shipstation-app/releases).

2.  **Extract the Files:** Unzip the downloaded package to your preferred development directory. This directory contains the Adobe App Builder project.

3.  **Configure App Builder Operational Environment Variables:** Before deploying, set the necessary environment variables for your App Builder actions as described in the [Environment Variables (App Builder Operational)](#environment-variables-app-builder-operational) section. These are critical for the App Builder app's ability to communicate with Adobe Commerce and perform internal encryption. You can do this by creating a `.env` file in the root of the extracted App Builder project.

4.  **Deploy App Builder Actions:**
    - Navigate to the root directory of the extracted App Builder project (where the `app.json` or `manifest.yml` file is located).

    - **(Optional) Set App Builder Context:** To avoid interactive prompts during deployment, you can explicitly set your project and workspace using `aio app use`:

      ```bash
      aio app use <your-project-id> <your-workspace-name>
      ```

      (Replace `<your-project-id>` and `<your-workspace-name>` with your actual values, which you can find in the Adobe Developer Console.)

    - Deploy the App Builder actions using the Adobe I/O CLI:

      ```bash
      aio app deploy
      ```

      If you didn't use `aio app use`, follow the prompts to select your App Builder project and workspace.

5.  **Configure ShipStation Settings in Adobe Commerce Backend:** After deploying the App Builder app, you **must** configure your ShipStation settings in your Adobe Commerce Admin panel as described in the [Configuration (Adobe Commerce Backend)](#configuration-adobe-commerce-backend) section.

---

## Configuration (Adobe Commerce Backend)

All ShipStation-specific configurations for this extension are managed by the merchant directly within the **Adobe Commerce Admin Panel**. The deployed Adobe App Builder application will then retrieve these settings at runtime via secure API calls to your Adobe Commerce instance.

1.  **Access ShipStation Configuration in Adobe Commerce:**
    - Log in to your Adobe Commerce Admin Panel.
    - Navigate to **ShipStation \> General Settings** in the left-hand navigation menu.
2.  **Configure ShipStation Settings:** Fill in the following details using information provided by ShipStation:
    - **Enable/Disable ShipStation Extension:** Select Yes or No to activate or deactivate the integration's functionality.
    - **ShipStation API Key:** Your ShipStation API Key.
    - **ShipStation API Secret:** Your ShipStation API Secret.
      _(Add any other ShipStation-specific configurations your extension supports, e.g., default warehouse, order status mapping, etc.)_
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


1. `get-rates`: This action get shipping rates for the cart.

   - For SaaS, register your action to `plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates` webhook method in **System > Webhooks > Webhooks Subscriptions**.
   - For PaaS, please refer to `webhooks.xml`. Replace the app builder URL with your action after deploying the App Builder application.

     ```xml
     <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_AdobeCommerceWebhooks:etc/webhooks.xsd">
        <method name="plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates" type="after">
        <hooks>
            <batch name="dps">
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

For **local development**, these are typically set in your `.env` file within your App Builder project. For **deployed environments (e.g., via Adobe Exchange Marketplace or CI/CD)**, these variables are configured directly within the Adobe Developer Console UI for your specific App Builder workspace/action, or provided via marketplace prompts during installation.

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

- `COMMERCE_CONSUMER_KEY`
  - **Description:** The consumer key obtained from your Adobe Commerce API credentials. This is used for OAuth 1.0a authentication with the Adobe Commerce API. This is highly sensitive and must be kept secure.
  - **Type:** String
  - **Example `.env` entry:**
    ```
    COMMERCE_CONSUMER_KEY=your_commerce_consumer_key
    ```

- `COMMERCE_CONSUMER_SECRET`
  - **Description:** The consumer secret obtained from your Adobe Commerce API credentials. This is used in conjunction with the consumer key for OAuth 1.0a authentication. This is highly sensitive and must be kept secure.
  - **Type:** String
  - **Example `.env` entry:**
    ```
    COMMERCE_CONSUMER_SECRET=your_commerce_consumer_secret
    ```

- `COMMERCE_ACCESS_TOKEN`
  - **Description:** The access token obtained after authorizing your application with Adobe Commerce. This token is used to make authenticated API requests. This is highly sensitive and must be kept secure.
  - **Type:** String
  - **Example `.env` entry:**
    ```
    COMMERCE_ACCESS_TOKEN=your_commerce_access_token
    ```

- `COMMERCE_ACCESS_TOKEN_SECRET`
  - **Description:** The access token secret obtained alongside the access token during the OAuth 1.0a authentication process with Adobe Commerce. This is highly sensitive and must be kept secure.
  - **Type:** String
  - **Example `.env` entry:**
    ```
    COMMERCE_ACCESS_TOKEN_SECRET=your_commerce_access_token_secret
    ```

### Shipstation Environment Configuration

To configure this application, be sure that the following environment variables are configured. This can either be done pre-deployment with the `.env` file in this repo, or configured in App Builder as part of the App installation process.

You can generate this file using the command `aio app use`.

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=

```

`aio app use` does not add these SHIPSTATION\_ prefixed variables and must be added manually.

**Important Notes:**

- **Security:** It's crucial to generate strong, unique values for `ENCRYPTION_KEY`, `ENCRYPTION_IV`. Don't use example values in production environments.
- **Don't Commit `.env`:** If you're using a `.env` file for local development, **DO NOT commit it to your version control system (e.g., Git)**. Add `.env` to your `.gitignore` file to prevent accidental exposure of sensitive information.

---

## Usage

Once the App Builder application is deployed and its settings are configured in the Adobe Commerce backend, this shipping method will then be able to be used as a regular shipping method.

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

We welcome contributions\! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to our coding standards.
4.  Write clear and concise commit messages.
5.  Submit a pull request.
