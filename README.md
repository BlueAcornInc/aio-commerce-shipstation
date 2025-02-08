# ShipStation for Adobe App Builder

ShipStation App for Adobe Commerce! This will be a playground to dupe the shipping functionality from the checkout starter, and will eventually become the full shipstation app

## ShipStation Getting Started

* [ShipStation API docs](https://docs.shipstation.com)
* [Adobe's Intital Sizing Doc with Reqs](https://groupinfosysus.sharepoint.com/:w:/s/AppBuilderTeam/EUx3Q61jBe5EoFmPFISPj3kBw5bZ9KG4G6n_4lN6NYJTOg?e=DHyJdX)


## Initial Scope Shared with Adobe

### From Adobe Sizing Doc

>  Integrate to shipstation shipping extension
https://commercemarketplace.adobe.com/auctane-api.html

### From Blue Acorn SOW

[View Source - Blue Acorn SOW for App Builder including Shipstation Work](https://docs.google.com/document/d/1csPluOejPnCXAH52mUQL5AYoNUHlqvre/edit)

Shipstation Module will integrate with Adobe Commerce, leveraging out-of-process extensibility techniques to introduce ShipStation shipping details into the native buyer experience. No ShipStation customizations (in-depth styling or customizations) in MVP implementation. 

* Base functionality for MVP, targeted in this SOW includes:
  * Core ShipStation integration to enable basic order fulfillment
* Base functionality will not include:
  * Shipment tracking label generation
  * The system can connect with the ShipStation platform and sync orders from Adobe Commerce

## Getting Started

These links were shared by Adobe as bit of a primer: 

* [Introduction to App Builder](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/adobe-developer-app-builder/introduction-to-app-builder)
* [Getting access to App Builder](https://developer.adobe.com/app-builder/docs/overview/getting_access/)
* [Back office starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/)
* [Installing the starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/create-integration/)
* [Checkout starter kit](https://github.com/adobe/commerce-checkout-starter-kit)
* Internal Knowledge: 
  * [#BLU-app-builder in Teams](https://teams.microsoft.com/l/channel/19%3A051oCCDZb2Yxa56RPVMxlMw36Pu5vjqmYNXI2yotRf01%40thread.tacv2/BLU-app-builder?groupId=ac33e213-3109-42cc-8cc7-67767dbe2433)
  * [Adobe - Checkout Session vs Client Side Nonce](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EcRLFdELp-xIreVnol2hQK0Be7txJQZ3wJTONYH64WiLQQ?e=gXJeBe)
  * [Adobe - Out-of-process Payment Gateway Integrations](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EXuOVZZp0ZhMoYOygzOgDO8B0GpGC-42f2fWMSIzrbQHWA?e=1Cghlr)
  * [Stripe - MVP Technical Specs](https://groupinfosysus.sharepoint.com/:b:/s/AppBuilderTeam/EXuOVZZp0ZhMoYOygzOgDO8B0GpGC-42f2fWMSIzrbQHWA?e=1Cghlr)


## Adobe Commerce Sandbox Environment

We have a sandbox environment 

* ["Evergreen" Adobe Commerce Sandbox Github Repo
](https://github.com/BlueAcornInc/showcase-evergreen-commerce)
* ["Evergreen" staging environment in Adobe Commerce Cloud](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging)
* ["Evergreen" LIVE staging instance](https://stage-sandbox.m2cloud.blueacorn.net)
* ["Evergreen" in Bitbucket Deployments](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments)

### Evergreen - The Mock Enterprise Organization
Evergreen is a mock enterprise-scalse organization, a persona of a business with the kinds of architectural needs we are trying to speak to. At current, Evergreen isn’t intended to be of the financial and resource scale  of a client we might want to attract, but one of our main project goals is to emulate ever sophisticated organizations. This will also help us in persuits like testing and honing new technologies we wish to introduce into the market, such as Adobe’s Real-time CDP where we need to learn the platform where we can successfully sell it. If we are able to mock an organization of significant scale, we could potentially service the data input needs of the CDP thus we’re both able to demonstrate this running at some scale, and perfect our implementation at the same time.


### Environments

Evergreen is hosted in the [Blue Acorn iCi Pro Sandbox](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4) Adobe Commerce Cloud project. We use the staging environment of this project as the live demo for our showcase, where the unstable development environment we do some testing to not disrupt staging.

***NOTE*** that the current CI/CD is sourced from the [Bitbucket Repo](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments), and the Github repo is a fork at this point. 

| Environment | Bitbucket Branch | Cloud Branch | Console  | Frontend | Admin |
|-------------|------------------|--------------|---------|----------|-------|
| **Staging**  | `main`           | `staging`    | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging) | [Frontend](https://stage-sandbox.m2cloud.blueacorn.net) | [Admin](https://stage-sandbox.m2cloud.blueacorn.net/index.php/admin_baici/) |
| **Unstable**    | `unstable`       | `unstable`   | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/unstable) | [Frontend](http://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud) | [Admin](https://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud/admin_baici/admin/) |

## Adobe App Builder Entitltements within the Admin Console

Access to App Builder is metered through the Adobe Admin Console where our organization handles the various Adobe product entitlements, such as AEMaaCS and Adobe Commerce Cloud. Users must exist in the `default` group to get access. 

* [App Builder Developer Console](https://developer.adobe.com)
* Adding Users:
  * [Developers section of Adobe I/O Runtime User is Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/users/developers)
  * [Adobe I/O Runtime Users in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/329E0E40B8550C6DF52A/profiles/195671759/admins)
  * [Adobe Experience Plartform in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/725EBBA0ED249E7DD6DA/users)

## Github Codespaces, .devcontainer and vscode

This project has a .devcontainer directory which contains a composition capable of running `aio` as well as a cors-anywhere proxy that can be used to get around https issues. To get started with VS Code and devcontainers, install the Remote - Containers extension, open your project in VS Code, and select "Reopen in Container" from the Command Palette. For more details, visit [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers). 

This project is also hosted in Github, where a Codespace can be used to potentially run this project. This environment is provided as-is, and developers to this project are free to leverage their own stacks. 


## Open Questions

We are still trying to figure this out, this is a set of questions we should send to the OOPE Lead Architect at Adobe [Russ Johnson](mailto:rujohnso@adobe.com) who can help guide us.

* naming and title convetions for app builder app? 
  * There's no camel-casing, spaces, underscores, dashes, etc etc...
* best template for aio app builder app? We do not see any "Commerce" related capabilities exposed in app builder. Do we need to get an entitlement enabled for this?
  * @adobe/generator-app-events-generic ?
  * @adobe/generator-app-api-mesh includes events and the mesh, builds correctly...
* How do we submit an app for "approval"? Does not seem to be exposed, see no section for "Commerce" apps...


## Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

## Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

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
   folder. We will use `webpack` to package your code and dependencies into a
   single minified js file. The action will then be deployed as a single file.
   Use this method if you want to reduce the size of your actions.

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

## Typescript support for UI

To use typescript use `.tsx` extension for react components and add a `tsconfig.json` 
and make sure you have the below config added
```
 {
  "compilerOptions": {
      "jsx": "react"
    }
  } 
```
