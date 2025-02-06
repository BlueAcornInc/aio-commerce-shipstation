# App Builder Payments Modules

This repo contains project details and a space to begin building the App Builder payment modules required for Stripe and Adyen.

## Github Codespaces, .devcontainer and vscode

This project has a .devcontainer directory which contains a composition capable of running `aio` as well as a cors-anywhere proxy that can be used to get around https issues. To get started with VS Code and devcontainers, install the Remote - Containers extension, open your project in VS Code, and select "Reopen in Container" from the Command Palette. For more details, visit [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers). 

This project is also hosted in Github, where a Codespace can be used to potentially run this project. This environment is provided as-is, and developers to this project are free to leverage their own stacks. 

## Adobe App Builder Entitltements within the Admin Console

Access to App Builder is metered through the Adobe Admin Console where our organization handles the various Adobe product entitlements, such as AEMaaCS and Adobe Commerce Cloud. Users must exist in the `default` group to get access. 

* [App Builder Developer Console](https://developer.adobe.com)
* Adding Users:
  * [Adobe I/O Runtime Users in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/329E0E40B8550C6DF52A/profiles/195671759/admins)
  * [Adobe Experience Plartform in Admin Console](https://adminconsole.adobe.com/86FF829657DCB10D7F000101@AdobeOrg/products/725EBBA0ED249E7DD6DA/users)


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

