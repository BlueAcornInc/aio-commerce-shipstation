const fetch = require('node-fetch');

/**
 * Calls ShipStation/ShipEngine /v2/rates endpoint with no defaults.
 * You must send all required fields or we return an error.
 *
 * Expected JSON payload (example):
 * {
 *   "shipment": {
 *     "ship_to": {
 *       "name": "Jane Doe",
 *       "phone": "555-111-2222",
 *       "address_line1": "1234 Main St",
 *       "city_locality": "Austin",
 *       "state_province": "TX",
 *       "postal_code": "78756",
 *       "country_code": "US"
 *     },
 *     "ship_from": {
 *       "name": "My Warehouse",
 *       "phone": "555-222-3333",
 *       "address_line1": "100 Warehouse Dr",
 *       "city_locality": "Austin",
 *       "state_province": "TX",
 *       "postal_code": "78756",
 *       "country_code": "US"
 *     },
 *     "packages": [
 *       {
 *         "weight": { "value": 3, "unit": "pound" },
 *         "dimensions": { "length": 10, "width": 6, "height": 4, "unit": "inch" }
 *       }
 *     ]
 *   },
 *   "rate_options": {
 *     "carrier_ids": ["se-1941419", "se-1941420"]
 *   }
 * }
 */
async function main(params) {
    const apiKey = params.SHIPSTATION_API_KEY || process.env.SHIPSTATION_API_KEY;
    if (!apiKey) {
        return errorResponse('Missing ShipStation API key.', 500);
    }

    // 1) Validate we have shipment + rate_options
    if (!params.shipment) {
        return errorResponse("Missing 'shipment' in request body.", 400);
    }
    if (!params.rate_options) {
        return errorResponse("Missing 'rate_options' in request body.", 400);
    }

    const { ship_to, ship_from, packages } = params.shipment;
    const { carrier_ids } = params.rate_options;

    // 2) Validate sub-objects
    if (!ship_to) {
        return errorResponse("Missing 'shipment.ship_to' object.", 400);
    }
    if (!ship_from) {
        return errorResponse("Missing 'shipment.ship_from' object.", 400);
    }
    if (!Array.isArray(packages) || packages.length === 0) {
        return errorResponse("No 'packages' defined in shipment.", 400);
    }
    if (!Array.isArray(carrier_ids) || carrier_ids.length === 0) {
        return errorResponse("No 'carrier_ids' specified in rate_options.", 400);
    }

    // 3) Validate mandatory fields in ship_to, ship_from
    const requiredFields = ['name', 'phone', 'address_line1', 'city_locality', 'state_province', 'postal_code', 'country_code'];

    const missingShipTo = requiredFields.filter(f => !ship_to[f]);
    const missingShipFrom = requiredFields.filter(f => !ship_from[f]);

    if (missingShipTo.length > 0) {
        return errorResponse(`Missing fields in 'ship_to': ${missingShipTo.join(', ')}`, 400);
    }
    if (missingShipFrom.length > 0) {
        return errorResponse(`Missing fields in 'ship_from': ${missingShipFrom.join(', ')}`, 400);
    }

    // 4) Construct the request body exactly as given
    const requestBody = {
        shipment: {
            ship_to,
            ship_from,
            packages
        },
        rate_options: {
            carrier_ids
        }
    };

    console.log('ShipStation v2/rates request:', JSON.stringify(requestBody, null, 2));

    // 5) Make the POST call
    let shipstationResponse;
    try {
        shipstationResponse = await fetch('https://api.shipstation.com/v2/rates', {
            method: 'POST',
            headers: {
                'API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
    } catch (err) {
        console.error('Network error calling ShipStation:', err);
        return errorResponse('Unable to contact ShipStation (network error)', 502);
    }

    if (!shipstationResponse.ok) {
        const errorBody = await shipstationResponse.text();
        console.error(`ShipStation API error [HTTP ${shipstationResponse.status}]:`, errorBody);
        return errorResponse(
            `ShipStation API error [${shipstationResponse.status}] - ${errorBody}`,
            shipstationResponse.status
        );
    }

    // 6) Parse the JSON response
    let responseData;
    try {
        responseData = await shipstationResponse.json();
    } catch (err) {
        console.error('Error parsing JSON:', err);
        return errorResponse('Error parsing response from ShipStation', 500);
    }

    // 7) Convert the response to shipping_methods array
    //    Check if we have top-level "rates" or "rate_response.rates"
    let rawRates = [];
    if (Array.isArray(responseData.rates)) {
        rawRates = responseData.rates;
    } else if (responseData.rate_response && Array.isArray(responseData.rate_response.rates)) {
        rawRates = responseData.rate_response.rates;
    }

    console.log('Raw rates:', JSON.stringify(rawRates, null, 2));

    const shippingMethods = rawRates.map(rate => {
        // Could be "shipping_amount.amount" or "shipment_cost"
        const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0;
        const serviceName = rate.service_name || rate.carrier_id || 'Carrier';
        return {
            carrier_code: 'shipstation',
            carrier_title: `ShipStation - ${serviceName}`,
            method_code: rate.rate_id || rate.service_code || 'unknown',
            method_title: serviceName,
            amount: cost,
            base_amount: cost,
            available: true
        };
    });

    return {
        statusCode: 200,
        body: { shipping_methods: shippingMethods }
    };
}

/** Helper for consistent error structure */
function errorResponse(message, statusCode) {
    return {
        statusCode: statusCode || 500,
        body: {
            error: message,
            shipping_methods: []
        }
    };
}

exports.main = main;
