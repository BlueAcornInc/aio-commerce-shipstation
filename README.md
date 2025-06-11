# ShipStation for Adobe App Builder

ShipStation App for Adobe Commerce! This will be a playground to dupe the shipping functionality from the checkout starter, and will eventually become the full shipstation app!

## ShipStation Getting Started

- [This Project in Adobe App Builder Developer Console](https://developer.adobe.com/console/projects/35582/4566206088345338585/overview)
- [ShipStation API docs](https://docs.shipstation.com)

## Adobe Commerce Sandbox Environment

We have a sandbox environment

- ["Evergreen" Adobe Commerce Sandbox Github Repo
  ](https://github.com/BlueAcornInc/showcase-evergreen-commerce)
- ["Evergreen" staging environment in Adobe Commerce Cloud](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging)
- ["Evergreen" LIVE staging instance](https://stage-sandbox.m2cloud.blueacorn.net)
- ["Evergreen" in Bitbucket Deployments](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments)


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
 
