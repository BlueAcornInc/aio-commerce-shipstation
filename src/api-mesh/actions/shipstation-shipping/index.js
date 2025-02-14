const fetch = require('node-fetch');

/**
 * Simple constant for HTTP success
 */
const HTTP_OK = 200;

/**
 * Returns a JSON Patch array containing one "error" shipping method.
 * In out-of-process shipping, returning a valid patch structure (even if it's "error")
 * avoids unexpected crashes in Magento.
 */
function errorResponse(message, statusCode = 500) {
    return {
        statusCode,
        body: JSON.stringify([
            {
                op: 'add',
                path: 'result',
                value: {
                    carrier_code: 'error',
                    method: 'error',
                    method_title: 'Error',
                    price: 0,
                    cost: 0,
                    additional_data: [
                        {
                            key: 'error',
                            value: message
                        }
                    ]
                }
            }
        ])
    };
}

/**
 * Main function to be called by Adobe Commerce out-of-process shipping webhook.
 *
 * Expects Commerce (or any client) to send a JSON payload with a "rateRequest" object
 * at the top level of params. Example:
 *
 * {
 *   "rateRequest": {
 *     "dest_country_id": "US",
 *     "dest_postcode": "78756",
 *     "dest_region_code": "TX",
 *     "dest_city": "Austin",
 *     "dest_street": "123 Warehouse Dr"
 *   }
 * }
 */
exports.main = async function main(params) {
    try {
        // 1) Extract the "rateRequest" object from params
        const { rateRequest } = params;
        if (!rateRequest) {
            return errorResponse('No rateRequest found in params.');
        }

        // 2) Extract address fields (with defaults for demonstration)
        const {
            dest_country_id: destCountryId = 'US',
            dest_postcode: destPostcode = '12345',
            dest_region_code = 'TX',
            dest_city = 'Austin',
            dest_street = '123 Warehouse Dr'
        } = rateRequest;

        // 3) Prepare ShipStation API key
        const shipstationApiKey = params.SHIPSTATION_API_KEY || process.env.SHIPSTATION_API_KEY;
        if (!shipstationApiKey) {
            return errorResponse('Missing ShipStation API key.');
        }

        // 4) Build minimal payload for ShipStation's /v2/rates
        const shipstationPayload = {
            shipment: {
                ship_to: {
                    name: 'Magento Customer',
                    phone: '555-111-2222',
                    address_line1: dest_street,
                    city_locality: dest_city,
                    state_province: dest_region_code,
                    postal_code: destPostcode,
                    country_code: destCountryId
                },
                ship_from: {
                    name: 'My Warehouse',
                    phone: '555-222-3333',
                    address_line1: '100 Warehouse Dr',
                    city_locality: 'Austin',
                    state_province: 'TX',
                    postal_code: '78756',
                    country_code: 'US'
                },
                packages: [
                    {
                        weight: { value: 3, unit: 'pound' },
                        dimensions: { length: 10, width: 6, height: 4, unit: 'inch' }
                    }
                ]
            },
            rate_options: {
                // Example carrier ID(s) – must match what's configured in ShipStation
                carrier_ids: ['se-1941419', 'se-1941420']
            }
        };

        // 5) Call ShipStation
        let shipstationResponse;
        try {
            shipstationResponse = await fetch('https://api.shipstation.com/v2/rates', {
                method: 'POST',
                headers: {
                    'API-Key': shipstationApiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shipstationPayload)
            });
        } catch (err) {
            return errorResponse(`Network error calling ShipStation: ${err.message}`, 502);
        }

        if (!shipstationResponse.ok) {
            const errorBody = await shipstationResponse.text();
            return errorResponse(
                `ShipStation API error [${shipstationResponse.status}]: ${errorBody}`,
                shipstationResponse.status
            );
        }

        // 6) Parse and extract ShipStation rates
        let responseData;
        try {
            responseData = await shipstationResponse.json();
        } catch (err) {
            return errorResponse(`Error parsing ShipStation response: ${err.message}`);
        }

        let rawRates = [];
        if (Array.isArray(responseData.rates)) {
            rawRates = responseData.rates;
        } else if (responseData.rate_response && Array.isArray(responseData.rate_response.rates)) {
            rawRates = responseData.rate_response.rates;
        }

        // 7) Convert ShipStation rates to JSON Patch "add" operations for Magento
        const operations = rawRates.map(rate => {
            const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0;
            const serviceName = rate.carrier_friendly_name || rate.carrier_id || 'Carrier';
            const methodCode = rate.service_type || rate.service_code || 'unknown';
            const carrierId = rate.carrier_id;

            return {
                op: 'add',
                path: 'result',
                value: {
                    carrier_code: carrierId,
                    method: serviceName,
                    method_title: methodCode,
                    price: cost,
                    cost: cost,
                    additional_data: [
                        {
                            key: 'shipstation_service',
                            value: serviceName
                        }
                    ]
                }
            };
        });

        // 8) Return the operations array
        return {
            statusCode: HTTP_OK,
            body: JSON.stringify(operations)
        };
    } catch (err) {
        // In case of any unforeseen error, return an errorResponse
        return errorResponse(`Server error: ${err.message}`);
    }
};
