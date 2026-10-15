# ShipStation by Blue Acorn

This Adobe App Builder extension provides a secure and efficient way for Adobe Commerce merchants to store and consume their ShipStation credentials. All configurations, including sensitive credentials, are managed directly within the Adobe Commerce Admin backend. The App Builder application securely retrieves these settings and makes them available to your storefront via API, enabling order fulfillment, shipping label generation, and integration with ShipStation services.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
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

Since v2.0.0, ShipStation installs and is configured through **Adobe Commerce App Management**. Installing registers the shipping-rates webhook and creates the ShipStation carrier in Commerce, so no Commerce module, `.env` carrier settings or setup script are needed.

1.  **Deploy the app** to your App Builder workspace (`aio app deploy`, or the repository's deploy workflows). It needs three things:
    - `AIO_COMMERCE_CONFIG_ENCRYPTION_KEY`: encrypts the ShipStation API key at rest. Generate one with `npx @adobe/aio-commerce-lib-config encryption setup` and keep it as a secret. Changing it later means re-entering the API key.
    - `COMMERCE_WEBHOOKS_PUBLIC_KEY`: verifies Commerce webhook signatures. Enable webhook signing in Commerce (Stores > Configuration > Adobe Services > Webhooks > Digital Signature) and copy the public key.
    - The workspace's OAuth server-to-server credential, passed as `AIO_COMMERCE_AUTH_IMS_*`, which the installation step uses to create the carrier.
2.  **Associate and install:** in Commerce Admin, go to **Apps > App Management**, associate the app with its workspace, then install it.
3.  **Configure it** at the scope you need:
    - **Status:** `On` to quote ShipStation rates at checkout.
    - **ShipStation API Key:** from ShipStation > Settings > API. Stored encrypted and never shown again.
    - **Carrier IDs:** comma-separated ShipStation carrier IDs to quote.
    - **Ship-from address:** name, phone, street, city, state, postal code, country.
    - **Default recipient name and phone** (optional).
4.  **Check checkout:** ShipStation rates appear as the `ShipStation` carrier's methods. With Status off, checkout simply offers no ShipStation methods.

### Upgrading from v1.x

v1 read its settings from a custom admin page and from build-time environment variables. Neither is used any more. After upgrading, re-enter the settings in App Management. The v1 `aio-commerce-shipstation-webhooks` Commerce module is no longer needed on SaaS, because App Management registers the webhook.

---

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
