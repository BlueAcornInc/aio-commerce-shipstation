/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * App Management configuration for ShipStation.
 *
 * Merchants configure these values in Commerce Admin (Apps > App Management),
 * per website, store or store view. Installing the app through App Management
 * registers the shipping-rates webhook and creates the ShipStation carrier,
 * so no Commerce module or manual setup script is needed.
 *
 * The ShipStation API key is a password field: lib-config encrypts it at rest
 * (random IV per value, AIO_COMMERCE_CONFIG_ENCRYPTION_KEY) and the admin UI
 * never shows it again.
 *
 * @see https://developer.adobe.com/commerce/extensibility/app-management/
 */
import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

const text = (name, label, description) => ({
  name,
  type: "text",
  label,
  description,
});

export default defineConfig({
  metadata: {
    id: "shipstation",
    displayName: "ShipStation",
    description:
      "Live ShipStation shipping rates at Adobe Commerce checkout, through out-of-process shipping methods",
    version: "2.0.0",
  },
  businessConfig: {
    schema: [
      {
        name: "status",
        type: "list",
        label: "Status",
        description: "Turn ShipStation rates on or off at checkout",
        selectionMode: "single",
        options: [
          { label: "On", value: "on" },
          { label: "Off", value: "off" },
        ],
        default: "off",
      },
      {
        name: "shipstationApiKey",
        type: "password",
        label: "ShipStation API Key",
        description:
          "From ShipStation > Settings > API. Stored encrypted and never shown again.",
      },
      text(
        "shipstationCarrierIds",
        "Carrier IDs",
        "Comma-separated ShipStation carrier IDs to quote, for example se-123456,se-654321.",
      ),
      text("warehouseName", "Ship-from name", "Warehouse or business name."),
      text("warehousePhone", "Ship-from phone", "Warehouse phone number."),
      text("warehouseAddressLine1", "Ship-from address", "Street address."),
      text("warehouseCityLocality", "Ship-from city", "City."),
      text(
        "warehouseStateProvince",
        "Ship-from state or province",
        "Two-letter code, for example NC.",
      ),
      text("warehousePostalCode", "Ship-from postal code", "Postal code."),
      text(
        "warehouseCountryCode",
        "Ship-from country",
        "Two-letter country code, for example US.",
      ),
      text(
        "shipToName",
        "Default recipient name",
        "Optional. Used when the rate request has no recipient name.",
      ),
      text(
        "shipToPhone",
        "Default recipient phone",
        "Optional. Used when the rate request has no recipient phone.",
      ),
    ],
  },
  webhooks: [
    {
      label: "ShipStation shipping rates",
      description:
        "Adds live ShipStation rates to the shipping methods offered at checkout.",
      category: "append",
      runtimeAction: "shipstation/shipstation-shipping",
      requireAdobeAuth: false,
      webhook: {
        webhook_method:
          "plugin.magento.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates",
        webhook_type: "after",
        batch_name: "shipping_methods",
        hook_name: "shipstation_rates",
        method: "POST",
        required: false,
        fallback_error_message:
          "Unable to retrieve ShipStation shipping rates.",
        fields: [{ name: "rateRequest", source: "rateRequest" }],
      },
    },
  ],
  installation: {
    messages: {
      preInstallation:
        "Installing registers the ShipStation shipping-rates webhook and creates the ShipStation shipping carrier. Configure your API key, carrier IDs and ship-from address afterwards.",
      postInstallation:
        "Set Status to On and enter your ShipStation API key, carrier IDs and ship-from address to start quoting rates.",
    },
    customInstallationSteps: [
      {
        script: "./scripts/install/create-carrier.js",
        name: "Create ShipStation carrier",
        description:
          "Creates the ShipStation out-of-process shipping carrier in Commerce.",
      },
    ],
  },
});
