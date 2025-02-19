/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License,
Version 2.0 (the "License"); you may not use this file
except in compliance with the License. You may obtain
a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in
writing, software distributed under the License is
distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND,
either express or implied. See the License for the
specific language governing permissions and limitations
under the License.
*/

const { Core } = require('@adobe/aio-sdk');
const { webhookErrorResponse } = require('../../../../lib/adobe-commerce');
const { HTTP_OK } = require('../../../../lib/http');
const fetch = require('node-fetch');

/**
 * Creates a JSON Patch "add" operation
 *
 * @param {object} carrierData - The carrier data for the shipping operation
 * @returns {object} The JSON Patch operation
 */
function createShippingOperation(carrierData) {
    return {
        op: 'add',
        path: 'result',
        value: carrierData,
    };
}

/**
 * Returns only real ShipStation rates. If ShipStation fails or returns
 * nothing, returns a single “error” shipping method so Commerce won't
 * complain about “must contain at least one operation.”
 *
 * Skips signature verification.
 *
 * @param {object} params the input parameters
 * @returns {Promise<object>} the response object
 */
async function main(params) {
    const logger = Core.Logger('shipping-methods', { level: params.LOG_LEVEL || 'info' });

    try {
        // 1) Parse the incoming request body (base64-encoded in params.__ow_body)
        const payload = JSON.parse(atob(params.__ow_body || ''));
        const { rateRequest: request } = payload || {};

        if (!request) {
            logger.error('Missing rateRequest in payload.');
            return webhookErrorResponse('Missing rateRequest in payload.');
        }

        // Extract address fields from rateRequest
        const {
            dest_country_id: destCountryId = 'US',
            dest_postcode: destPostcode = '12345',
            dest_region_code: destRegionCode = 'TX',
            dest_city: destCity = 'Austin',
            dest_street: destStreet = '123 Warehouse Dr',
        } = request;

        logger.info('Received request:', request);

        // 2) Call ShipStation to get real rates
        const shipstationApiKey = params.SHIPSTATION_API_KEY || process.env.SHIPSTATION_API_KEY;
        if (!shipstationApiKey) {
            logger.warn('No SHIPSTATION_API_KEY found. Returning error method.');
            return singleErrorMethod('Missing ShipStation API key.');
        }

        const shipstationPayload = {
            shipment: {
                ship_to: {
                    name: 'Magento Customer',
                    phone: '555-111-2222',
                    address_line1: destStreet,
                    city_locality: destCity,
                    state_province: destRegionCode,
                    postal_code: destPostcode,
                    country_code: destCountryId,
                },
                ship_from: {
                    name: 'My Warehouse',
                    phone: '555-222-3333',
                    address_line1: '100 Warehouse Dr',
                    city_locality: 'Austin',
                    state_province: 'TX',
                    postal_code: '78756',
                    country_code: 'US',
                },
                packages: [
                    {
                        weight: { value: 3, unit: 'pound' },
                        dimensions: { length: 10, width: 6, height: 4, unit: 'inch' },
                    },
                ],
            },
            rate_options: {
                carrier_ids: ['se-1941419', 'se-1941420'],
            },
        };

        let rawRates = [];
        try {
            const res = await fetch('https://api.shipstation.com/v2/rates', {
                method: 'POST',
                headers: {
                    'API-Key': shipstationApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shipstationPayload),
            });

            if (!res.ok) {
                const errTxt = await res.text();
                logger.error(`ShipStation call failed (HTTP ${res.status}): ${errTxt}`);
            } else {
                const data = await res.json();
                logger.info('ShipStation response:', JSON.stringify(data));

                if (Array.isArray(data.rates)) {
                    rawRates = data.rates;
                } else if (data.rate_response && Array.isArray(data.rate_response.rates)) {
                    rawRates = data.rate_response.rates;
                }
            }
        } catch (err) {
            logger.error('Network error calling ShipStation:', err.message);
        }

        // 3) Convert ShipStation rates
        const operations = [];
        for (const rate of rawRates) {
            const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0;
            const serviceName = rate.carrier_friendly_name || rate.carrier_id || 'Carrier';
            const methodCode = rate.service_type || rate.service_code || 'unknown';

            operations.push(
                createShippingOperation({
                    carrier_code: 'ShipStation',
                    method: serviceName,
                    method_title: methodCode,
                    price: cost,
                    cost,
                    additional_data: [
                        {
                            key: 'shipstation_service',
                            value: serviceName,
                        },
                    ],
                })
            );
        }

        // If no valid rates were found, return an error shipping method
        if (operations.length === 0) {
            logger.warn('No ShipStation rates found; returning error shipping method.');
            return singleErrorMethod('No ShipStation rates available.');
        }

        // Otherwise, return them
        return {
            statusCode: HTTP_OK,
            body: JSON.stringify(operations),
        };
    } catch (error) {
        logger.error('Server error:', error);
        return singleErrorMethod(`Server error: ${error.message}`);
    }
}

/**
 * Returns a JSON Patch array with a single "error" shipping method
 * to avoid “must contain at least one operation” errors in Magento.
 */
function singleErrorMethod(message) {
    const op = {
        op: 'add',
        path: 'result',
        value: {
            carrier_code: 'ShipStation',
            method: 'error',
            method_title: 'ShipStation Not Available',
            price: 0,
            cost: 0,
            additional_data: [
                {
                    key: 'error',
                    value: message,
                },
            ],
        },
    };

    return {
        statusCode: 200,
        body: JSON.stringify([op]),
    };
}

exports.main = main;
