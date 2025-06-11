# Environments 

## Evergreen - The Mock Enterprise Organization

Evergreen is a mock enterprise-scale organization, a persona of a business with the kinds of architectural needs we are trying to speak to. At current, Evergreen isn’t intended to be of the financial and resource scale of a client we might want to attract, but one of our main project goals is to emulate ever sophisticated organizations. This will also help us in pursuits like testing and honing new technologies we wish to introduce into the market, such as Adobe’s Real-time CDP where we need to learn the platform where we can successfully sell it. If we are able to mock an organization of significant scale, we could potentially service the data input needs of the CDP thus we’re both able to demonstrate this running at some scale, and perfect our implementation at the same time.

### Environments

Evergreen is hosted in the [Blue Acorn iCi Pro Sandbox](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4) Adobe Commerce Cloud project. We use the staging environment of this project as the live demo for our showcase, where the unstable development environment we do some testing to not disrupt staging.

**_NOTE_** that the current CI/CD is sourced from the [Bitbucket Repo](https://bitbucket.org/blueacorn/showcase-evergreen-commerce/deployments), and the Github repo is a fork at this point.

| Environment  | Bitbucket Branch | Cloud Branch | Console                                                                            | Frontend                                                                 | Admin                                                                                     |
| ------------ | ---------------- | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Staging**  | `main`           | `staging`    | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/staging)  | [Frontend](https://stage-sandbox.m2cloud.blueacorn.net)                  | [Admin](https://stage-sandbox.m2cloud.blueacorn.net/index.php/admin_baici/)               |
| **Unstable** | `unstable`       | `unstable`   | [Console](https://console.adobecommerce.com/acadminblu67f4/tupar6lous4x4/unstable) | [Frontend](http://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud) | [Admin](https://unstable-s7xr52a-tupar6lous4x4.us-4.magentosite.cloud/admin_baici/admin/) |
