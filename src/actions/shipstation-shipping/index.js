/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0.
*/
const { Core } = require('@adobe/aio-sdk');
const { HTTP_OK } = require('../../../lib/http');
const fetch = require('node-fetch');

/**
 * Creates a JSON Patch "add" operation
 */
function createShippingOperation(carrierData) {
    return { op: 'add', path: 'result', value: carrierData };
}

/**
 * Returns a single error shipping method with optional detailed debug info
 */
function singleErrorMethod(message, options = {}) {
    const { error, apiKey, payload, httpStatus, responseText, debugMode } = options;

    // Check if debugging is enabled (case-insensitive 'true')
    const isDebuggingEnabled = String(debugMode).toLowerCase() === 'true';

    if (isDebuggingEnabled) {
        // Mask API key, showing only last 4 characters if provided
        const maskedApiKey = apiKey ? `${'*'.repeat(Math.max(0, apiKey.length - 4))}${apiKey.slice(-4)}` : 'Not provided';

        // Build detailed error message
        let detailedMessage = message;
        const additionalData = [{ key: 'error', value: message }];

        if (error) {
            detailedMessage += ` | Stack: ${error.stack || error.message}`;
            additionalData.push({ key: 'stack_trace', value: error.stack || error.message });
        }
        if (apiKey) {
            detailedMessage += ` | API Key: ${maskedApiKey}`;
            additionalData.push({ key: 'api_key_used', value: maskedApiKey });
        }
        if (payload) {
            detailedMessage += ` | Payload: ${JSON.stringify(payload)}`;
            additionalData.push({ key: 'shipstation_payload', value: JSON.stringify(payload) });
        }
        if (httpStatus) {
            detailedMessage += ` | HTTP Status: ${httpStatus}`;
            additionalData.push({ key: 'http_status', value: String(httpStatus) });
        }
        if (responseText) {
            detailedMessage += ` | Response: ${responseText}`;
            additionalData.push({ key: 'api_response', value: responseText });
        }

        detailedMessage;
        return {
            statusCode: 200,
            body: JSON.stringify([
                {
                    op: 'add',
                    path: 'result',
                    value: {
                        carrier_code: 'ShipStation',
                        method: 'error',
                        method_title: `ShipStation Error: ${message}`,
                        price: 0,
                        cost: 0,
                        additional_data: additionalData,
                    },
                },
            ]),
        };
    }

    // Default behavior when debugging is not enabled
    return {
        statusCode: 200,
        body: JSON.stringify([
            {
                op: 'add',
                path: 'result',
                value: {
                    carrier_code: 'ShipStation',
                    method: 'error',
                    method_title: `ShipStation Error: ${message}`,
                    price: 0,
                    cost: 0,
                    additional_data: [{ key: 'error', value: message }],
                },
            },
        ]),
    };
}

/**
 * Builds packages array from rateRequest, with fallback for missing items
 */
function buildPackages(rateRequest, logger) {
    const packages = [];

    if (!rateRequest || typeof rateRequest !== 'object') {
        logger.warn('rateRequest is missing or invalid, returning a single fallback package with weight=1.');
        return [{ weight: { value: 1, unit: 'pound' } }];
    }

    logger.debug('Checking for items in rateRequest:', rateRequest.items);
    if (Array.isArray(rateRequest.items) && rateRequest.items.length > 0) {
        logger.info('Items found, processing:', rateRequest.items);
        for (const item of rateRequest.items) {
            packages.push({
                weight: { value: item.weight || 1, unit: 'pound' },
            });
        }
    } else {
        logger.warn('No valid items array in rateRequest, returning a single fallback package with weight=1.');
        packages.push({ weight: { value: 1, unit: 'pound' } });
    }

    return packages;
}

/**
 * Main function
 */
async function main(params) {
    const logger = Core.Logger('shipping-methods', { level: params.LOG_LEVEL || 'info' });
    const debugMode = params.SHIPSTATION_DEBUGGING || process.env.SHIPSTATION_DEBUGGING;

    try {
        logger.debug('Raw params:', params);
        logger.debug('Raw __ow_body:', params.__ow_body || '(none)');

        // Check debugging mode early

        if (!params.__ow_body) {
            logger.error('No body received from Magento.');
            return singleErrorMethod('No Payload Received', { debugMode });
        }

        let payload;
        try {
            payload = JSON.parse(atob(params.__ow_body));
            logger.debug('Decoded payload:', payload);
        } catch (e) {
            logger.error('Failed to decode payload:', e.message);
            return singleErrorMethod('Invalid Payload Format', { error: e, debugMode });
        }

        const { rateRequest: request } = payload || {};
        if (!request) {
            logger.error('Missing rateRequest in payload:', payload);
            return singleErrorMethod('Missing Rate Request', { debugMode });
        }

        logger.info('Parsed rateRequest:', request);

        const {
            dest_country_id: destCountryId,
            dest_postcode: destPostcode,
            dest_region_code: destRegionCode,
            dest_city: destCity,
            dest_street: destStreet,
        } = request;

        if (
            !destCountryId ||
            !destPostcode ||
            !destRegionCode ||
            !destCity ||
            !destStreet
        ) {
            logger.error('One or more required address fields are missing in the rateRequest.');
            return singleErrorMethod('Missing required shipping address fields', { debugMode });
        }

        // Build packages
        const packages = buildPackages(request, logger);
        logger.debug('Generated packages:', packages);

        // Required: ShipStation API key
        const shipstationApiKey = params.SHIPSTATION_API_KEY || process.env.SHIPSTATION_API_KEY;
        if (!shipstationApiKey) {
            logger.error('Missing SHIPSTATION_API_KEY.');
            return singleErrorMethod('Missing API Key', { debugMode });
        }

        let carrierIds = params.SHIPSTATION_CARRIER_IDS || process.env.SHIPSTATION_CARRIER_IDS;
        if (!carrierIds) {
            logger.error('Missing SHIPSTATION_CARRIER_IDS.');
            return singleErrorMethod('Missing Carrier IDs', { debugMode });
        }
        carrierIds = carrierIds.split(',').map(id => id.trim());

        const warehouseName = params.SHIPSTATION_WAREHOUSE_NAME || process.env.SHIPSTATION_WAREHOUSE_NAME;
        const warehousePhone = params.SHIPSTATION_WAREHOUSE_PHONE || process.env.SHIPSTATION_WAREHOUSE_PHONE;
        const warehouseAddressLine1 = params.SHIPSTATION_WAREHOUSE_ADDRESS_LINE1 || process.env.SHIPSTATION_WAREHOUSE_ADDRESS_LINE1;
        const warehouseCityLocality = params.SHIPSTATION_WAREHOUSE_CITY || process.env.SHIPSTATION_WAREHOUSE_CITY;
        const warehouseStateProvince = params.SHIPSTATION_WAREHOUSE_REGION || process.env.SHIPSTATION_WAREHOUSE_REGION;
        const warehousePostalCode = params.SHIPSTATION_WAREHOUSE_POSTCODE || process.env.SHIPSTATION_WAREHOUSE_POSTCODE;
        const warehouseCountryCode = params.SHIPSTATION_WAREHOUSE_COUNTRY || process.env.SHIPSTATION_WAREHOUSE_COUNTRY;

        if (
            !warehouseName ||
            !warehousePhone ||
            !warehouseAddressLine1 ||
            !warehouseCityLocality ||
            !warehouseStateProvince ||
            !warehousePostalCode ||
            !warehouseCountryCode
        ) {
            logger.error('One or more required warehouse fields are missing in env or params.');
            return singleErrorMethod('Missing required warehouse fields', { debugMode });
        }

        const shipToName = params.SHIPSTATION_SHIPTO_NAME || process.env.SHIPSTATION_SHIPTO_NAME;
        const shipToPhone = params.SHIPSTATION_SHIPTO_PHONE || process.env.SHIPSTATION_SHIPTO_PHONE;

        // Build the ShipStation payload
        const shipstationPayload = {
            shipment: {
                ship_to: {
                    name: shipToName || '',
                    phone: shipToPhone || '',
                    address_line1: destStreet,
                    city_locality: destCity,
                    state_province: destRegionCode,
                    postal_code: destPostcode,
                    country_code: destCountryId,
                },
                ship_from: {
                    name: warehouseName,
                    phone: warehousePhone,
                    address_line1: warehouseAddressLine1,
                    city_locality: warehouseCityLocality,
                    state_province: warehouseStateProvince,
                    postal_code: warehousePostalCode,
                    country_code: warehouseCountryCode,
                },
                packages,
            },
            rate_options: {
                carrier_ids: carrierIds,
            },
        };

        logger.debug('ShipStation payload:', shipstationPayload);

        // Call ShipStation
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
                logger.error(`ShipStation failed (HTTP ${res.status}): ${errTxt}`);
                return singleErrorMethod('ShipStation API Error', {
                    apiKey: shipstationApiKey,
                    payload: shipstationPayload,
                    httpStatus: res.status,
                    responseText: errTxt,
                    debugMode,
                });
            }

            const data = await res.json();
            logger.info('ShipStation response:', data);
            rawRates = data.rates || data.rate_response?.rates || [];
        } catch (err) {
            logger.error('Network error calling ShipStation:', err.message);
            return singleErrorMethod('ShipStation Network Error', {
                error: err,
                apiKey: shipstationApiKey,
                payload: shipstationPayload,
                debugMode,
            });
        }

        /**
         * Convert rates to JSON Patch operations.
         * Only the "method" property gets a "_x" suffix if duplicate.
         */
        const usedMethodNames = {};
        const operations = rawRates.map(rate => {
            const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0;
            const serviceName = rate.carrier_friendly_name || rate.carrier_id || 'Carrier';
            const methodCode = rate.service_type || rate.service_code || 'unknown';

            let method = rate.service_code || methodCode;

            if (usedMethodNames[method]) {
                usedMethodNames[method] += 1;
                method = `${method}_${usedMethodNames[method]}`;
            } else {
                usedMethodNames[method] = 1;
            }

            return createShippingOperation({
                carrier_code: 'ShipStation',
                method,
                method_title: methodCode,
                price: cost,
                cost,
                additional_data: [
                    { key: 'shipstation_service', value: serviceName },
                ],
            });
        });

        if (operations.length === 0) {
            logger.warn('No ShipStation rates found.');
            return singleErrorMethod('No Rates Available', { apiKey: shipstationApiKey, payload: shipstationPayload, debugMode });
        }

        return {
            statusCode: HTTP_OK,
            body: JSON.stringify(operations),
        };
    } catch (error) {
        logger.error('Unexpected error:', error);
        return singleErrorMethod('Server Error', { error, debugMode });
    }
}

exports.main = main;