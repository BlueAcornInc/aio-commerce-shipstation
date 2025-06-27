# Configuration

To configure this application, be sure that the following environment variables are configured. This can either be done pre-deployment with the `.env` file in this repo, or configured in App Builder as part of the App installation process.

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

`aio app use` does not add these SHIPSTATION_ prefixed variables and must be added manually. 
