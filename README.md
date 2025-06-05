# ShipStation for Adobe App Builder

ShipStation App for Adobe Commerce! This will be a playground to dupe the shipping functionality from the checkout starter, and will eventually become the full shipstation app!

## ShipStation Getting Started

- [This Project in Adobe App Builder Developer Console](https://developer.adobe.com/console/projects/35582/4566206088345338585/overview)
- [ShipStation API docs](https://docs.shipstation.com)
- [Adobe's Intital Sizing Doc with Reqs](https://groupinfosysus.sharepoint.com/:w:/s/AppBuilderTeam/EUx3Q61jBe5EoFmPFISPj3kBw5bZ9KG4G6n_4lN6NYJTOg?e=DHyJdX)

## Initial Scope Shared by Adobe

> Integrate to shipstation shipping extension
> https://commercemarketplace.adobe.com/auctane-api.html

## Scope Agreed to in Blue Acorn SOW

[View Source - Blue Acorn SOW for App Builder including Shipstation Work](https://docs.google.com/document/d/1csPluOejPnCXAH52mUQL5AYoNUHlqvre/edit)

Shipstation Module will integrate with Adobe Commerce, leveraging out-of-process extensibility techniques to introduce ShipStation shipping details into the native buyer experience. No ShipStation customizations (in-depth styling or customizations) in MVP implementation.

- Base functionality for MVP, targeted in this SOW includes:
    - Core ShipStation integration to enable basic order fulfillment
- Base functionality will not include:
    - Shipment tracking label generation
    - The system can connect with the ShipStation platform and sync orders from Adobe Commerce

## Getting Started

These links were shared by Adobe as bit of a primer:

- [Introduction to App Builder](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/adobe-developer-app-builder/introduction-to-app-builder)
- [Getting access to App Builder](https://developer.adobe.com/app-builder/docs/overview/getting_access/)
- [Back office starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/)
- [Installing the starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/create-integration/)
- [Checkout starter kit](https://github.com/adobe/commerce-checkout-starter-kit)
- [Adobe I/O Events Installation](https://developer.adobe.com/commerce/extensibility/events/installation/)
- Internal Knowledge:
    - [#BLU-app-builder in Teams](https://teams.microsoft.com/l/channel/19%3A051oCCDZb2Yxa56RPVMxlMw36Pu5vjqmYNXI2yotRf01%40thread.tacv2/BLU-app-builder?groupId=ac33e213-3109-42cc-8cc7-67767dbe2433)
    - [Adobe - Checkout Session vs Client Side Nonce](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EcRLFdELp-xIreVnol2hQK0Be7txJQZ3wJTONYH64WiLQQ?e=gXJeBe)
    - [Adobe - Out-of-process Payment Gateway Integrations](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EXuOVZZp0ZhMoYOygzOgDO8B0GpGC-42f2fWMSIzrbQHWA?e=1Cghlr)
    - [Stripe - MVP Technical Specs](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EXuOVZZp0ZhMoYOygzOgDO8B0GpGC-42f2fWMSIzrbQHWA?e=1Cghlr)

## Technical Approach (From Adobe)

Adobe provided the following guidance on how to proceed with this module. Let's review and try to implement the following:

- call Ship Station API to calculate shipping charges during checkout
    - OOP Shipping Method with new get_rates webhook
    - https://developer.adobe.com/commerce/extensibility/starter-kit/checkout/use-cases/#shipping-methods
    - https://developer.adobe.com/commerce/extensibility/starter-kit/checkout/shipping-reference/
- export orders from Commerce to Ship Station for fulfillment
    - event based backend integration
    - https://developer.adobe.com/commerce/extensibility/starter-kit/integration/events/
- inventory levels synchronized between Commerce and Ship Station
    - event based backend integration
    - https://developer.adobe.com/commerce/extensibility/starter-kit/integration/stock/
- tracking information from Ship Station sent to Commerce
    - event based integration
    - https://developer.adobe.com/commerce/extensibility/starter-kit/integration/shipments/
- new feature: in the US Ship Station can provide rate options that customers can select during checkout For EDS Storefront, either:
    - provide sample glue code to load your own UI component into EDS Storefront
    - implement frontend component with EDS Drop-in SDK
    - https://experienceleague.adobe.com/developer/commerce/storefront/dropins/all/introduction/
- configuration in Admin
    - React SPA as part of App Builder application and loaded into Commerce Admin
    - SPA has API access to Commerce and App Builder
    - https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/

## Adobe Commerce Sandbox Environment

We have a sandbox environment

- ["Evergreen" Adobe Commerce Sandbox Github Repo
  ](https://github.com/BlueAcornInc/showcase-evergreen-commerce)
- ["Evergreen" staging environment in Adobe Commerce Cloud](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging)
- ["Evergreen" LIVE staging instance](https://stage-sandbox.m2cloud.blueacorn.net)
- ["Evergreen" in Bitbucket Deployments](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments)

### Evergreen - The Mock Enterprise Organization

Evergreen is a mock enterprise-scale organization, a persona of a business with the kinds of architectural needs we are trying to speak to. At current, Evergreen isn’t intended to be of the financial and resource scale of a client we might want to attract, but one of our main project goals is to emulate ever sophisticated organizations. This will also help us in pursuits like testing and honing new technologies we wish to introduce into the market, such as Adobe’s Real-time CDP where we need to learn the platform where we can successfully sell it. If we are able to mock an organization of significant scale, we could potentially service the data input needs of the CDP thus we’re both able to demonstrate this running at some scale, and perfect our implementation at the same time.

### Environments

Evergreen is hosted in the [Blue Acorn iCi Pro Sandbox](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4) Adobe Commerce Cloud project. We use the staging environment of this project as the live demo for our showcase, where the unstable development environment we do some testing to not disrupt staging.

**_NOTE_** that the current CI/CD is sourced from the [Bitbucket Repo](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments), and the Github repo is a fork at this point.

| Environment  | Bitbucket Branch | Cloud Branch | Console                                                                            | Frontend                                                                 | Admin                                                                                     |
| ------------ | ---------------- | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Staging**  | `main`           | `staging`    | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging)  | [Frontend](https://stage-sandbox.m2cloud.blueacorn.net)                  | [Admin](https://stage-sandbox.m2cloud.blueacorn.net/index.php/admin_baici/)               |
| **Unstable** | `unstable`       | `unstable`   | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/unstable) | [Frontend](http://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud) | [Admin](https://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud/admin_baici/admin/) |

## Adobe App Builder Entitltements within the Admin Console

Access to App Builder is metered through the Adobe Admin Console where our organization handles the various Adobe product entitlements, such as AEMaaCS and Adobe Commerce Cloud. Users must exist in the `default` group to get access.

- [App Builder Developer Console](https://developer.adobe.com)
- Adding Users:
    - [Developers section of Adobe I/O Runtime User is Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/users/developers)
    - [Adobe I/O Runtime Users in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/329E0E40B8550C6DF52A/profiles/195671759/admins)
    - [Adobe Experience Plartform in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/725EBBA0ED249E7DD6DA/users)

## Github Codespaces, .devcontainer and vscode

This project has a .devcontainer directory which contains a composition capable of running `aio` as well as a cors-anywhere proxy that can be used to get around https issues. To get started with VS Code and devcontainers, install the Remote - Containers extension, open your project in VS Code, and select "Reopen in Container" from the Command Palette. For more details, visit [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers).

This project is also hosted in Github, where a Codespace can be used to potentially run this project. This environment is provided as-is, and developers to this project are free to leverage their own stacks.

## Open Questions

We are still trying to figure this out, this is a set of questions we should send to the OOPE Lead Architect at Adobe [Russ Johnson](mailto:rujohnso@adobe.com) who can help guide us.

- Our current idea is to take the aio templates mentioned below, and we port the shipping method runtimes over, and the configuration yaml... how does this get applied to multiple storefronts?
- There is an [app generation command](https://developer.adobe.com/commerce/extensibility/events/installation/#on-premise-installation) how does this work? If this needs to generate based on oope events and the connector data, seems a developer _would_ need to have this locally to perform the initial generation... seems complex, can they talk us through?
- [link to subscribing events](https://developer.adobe.com/commerce/extensibility/events/commands/#subscribe-to-an-event) this shows me creating an io_events.yaml in commerce core to register events, or running `bin/magento event:subscribe` but surely we shouldn't have to make any change to commerce core. How is this managed?\* naming and title conventions for app builder app?
    - There's no camel-casing, spaces, underscores, dashes, etc etc...
- best template for aio app builder app? We do not see any "Commerce" related capabilities exposed in app builder. Do we need to get an entitlement enabled for this?
    - @adobe/generator-app-events-generic ?
    - @adobe/generator-app-api-mesh includes events and the mesh, builds correctly...
- How do we submit an app for "approval"? Does not seem to be exposed, see no section for "Commerce" apps...
- How do we set up the commerce connector locally? Is there a way to configure the staging and production commerce connector keys as environment variables?
- Also seems like we do not have enough data spaces for local development, can you remark on how data spaces are generally done?
- I understand that a merchant will want a combination of app builder apps layered on top of each other to provide like payment methods and shippiung methods... but [this explaination](https://developer.adobe.com/commerce/extensibility/events/configure-commerce/) certainly makes it seem that it's one app builder app to one merchant instance. How do multiple app builder apps co-exist on one event bus? How is this configured?
- Can you describe a typical development lifecycle? Do each developer create their own local commerce instances, or with the central app builder app can we all edit against like our staging sandbox? What is typical?
- Can we get a breakdown of how these commerce apps are typically structured? We can demonstrate this repo to give our understanding so far...

## Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

You can generate this file using the command `aio app use`.

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
# SHIPSTATION_API_KEY=123abcxyz
# SHIPSTATION_CARRIER_IDS=se-1941419,se-1941420
# SHIPSTATION_WAREHOUSE_NAME=Acme Warehouse
# SHIPSTATION_WAREHOUSE_PHONE=999-999-9999
# SHIPSTATION_WAREHOUSE_ADDRESS_LINE1=999 Vegas Ave
# SHIPSTATION_WAREHOUSE_CITY=Las Vegas
# SHIPSTATION_WAREHOUSE_REGION=NV
# SHIPSTATION_WAREHOUSE_POSTCODE=89100
# SHIPSTATION_WAREHOUSE_COUNTRY=US

```

### `app.config.yaml`

- Main configuration file that defines an application's implementation.
- More information on this file, application configuration, and extension configuration
  can be found [here](https://developer.adobe.com/app-builder/docs/guides/appbuilder-configuration/#appconfigyaml)

#### Action Dependencies

- You have two options to resolve your actions' dependencies:

    1. **Packaged action file**: Add your action's dependencies to the root
       `package.json` and install them using `npm install`. Then set the `function`
       field in `app.config.yaml` to point to the **entry file** of your action
       folder.

    2. **Zipped action folder**: In the folder containing the action code add a
       `package.json` with the action's dependencies. Then set the `function`
       field in `app.config.yaml` to point to the **folder** of that action. We will
       install the required dependencies within that directory and zip the folder
       before deploying it as a zipped action. Use this method if you want to keep
       your action's dependencies separated.

## Debugging in VS Code

While running your local server (`aio app run`), both UI and actions can be debugged, to do so open the vscode debugger
and select the debugging configuration called `WebAndActions`.
Alternatively, there are also debug configs for only UI and each separate action.


# Local setup
You need the following prerequisites to test on local:

- https://localhost:8443 AC instance up and running using the evergreen repo
- Your app builder repo must be inside the AC root codebase.
- Admin SDK module installed in AC composer.json the following line: `"magento/commerce-backend-sdk": "2.2.0 as 1.4.1",`
- IMS auth on your local AC instance.

## IMS Faking
<https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/configuration/>
get node server snippet from there and paste it inside a random directory in your AC container. This must be done inside AC php container. Run `node server.js` after generating key/cert following instructions in that link above.

This short circuits the ims authorization and serves you the aio app. In your aio app dir,

## Next Steps
Shell into magento container inside your aio app dir and set up aio:\
`npm install -g @adobe/aio-cli`\
Navigate to your AIO app repo codebase (inside the AC codebase as mentioned before)
Run`aio auth:login`. Once installed make sure you have a project workspace already in [Adobe console developer (ACD) ](https://developer.adobe.com/console/projects/) set up.

Go into your builder project workspace and select "Download All" to get the json at the top right of ACD.
save this as `config.json` in your aio app dir.  Run `aio app use config.json` to load the profile. To launch your app

Once you got to this stage, and you still have `server.js` running:
- Run `aio app dev`
- Go to admin AC admin area:
  Stores -> Configuration Adobe Services -> Admin UI SDK

**General configuration**
Enable Admin UI SDK: Yes
(Enable the AdobeAdminims module to use the Admin UI SDK.)

**Testing**
Enable testing: Yes
Local Server Base URL: https://localhost:9090/
Mock AdobeAdminIms Module: Yes

- Save
- Click "Refresh Integrations" in that admin area

This registers the menu and you should see it now after admin refresh. But the form wont load. to do that:

## Backend Form

- Cancel out of the aio app dev command currently running,  It's already registered and does not need to run all the time.
  If you have 2 apps running, 1 of them being Admin SDK form and 1 of them being another application ( reference your `app.config.yaml` file of your AIO app, then you need to run `aio app run -e [application_name]` to deploy the endpoints or runtime functions to adobe before your form can work completely if it has dependencies on it. You will see message in terminal saying it was successfully deployed. now terminate that command with ctrl+c.
- Run `aio app run -e commerce/backend-ui/1`
-  Go back to Magento admin, refresh, and you should see the form load in the space now.
 
