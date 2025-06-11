# Technical Approach

Please note that this was authored before development began and might be out of date. It is placed here as a reference for future Blue Acorn team members to get some context on the project.

## Initial Scope Shared by Adobe

> Integrate to shipstation shipping extension
> https://commercemarketplace.adobe.com/auctane-api.html

- [Adobe's Intital Sizing Doc with Reqs](https://groupinfosysus.sharepoint.com/:w:/s/AppBuilderTeam/EUx3Q61jBe5EoFmPFISPj3kBw5bZ9KG4G6n_4lN6NYJTOg?e=DHyJdX)


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


## Backend Form

- Cancel out of the aio app dev command currently running,  It's already registered and does not need to run all the time.
  If you have 2 apps running, 1 of them being Admin SDK form and 1 of them being another application ( reference your `app.config.yaml` file of your AIO app, then you need to run `aio app run -e [application_name]` to deploy the endpoints or runtime functions to adobe before your form can work completely if it has dependencies on it. You will see message in terminal saying it was successfully deployed. now terminate that command with ctrl+c.
- Run `aio app run -e commerce/backend-ui/1`
-  Go back to Magento admin, refresh, and you should see the form load in the space now.
 
