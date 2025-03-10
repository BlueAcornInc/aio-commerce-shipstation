// src/app/actions/shipstation-shipping/index.js
const { Core } = require('@adobe/aio-sdk')
const fetch = require('node-fetch')
const stateLib = require('@adobe/aio-lib-state')

function createShippingOperation(carrierData) {
    return { op: 'add', path: 'result', value: carrierData }
}

function singleErrorMethod(message) {
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
                    additional_data: [{ key: 'error', value: message }]
                }
            }
        ])
    }
}

function buildPackages(rateRequest, logger) {
    const packages = []
    if (!rateRequest || typeof rateRequest !== 'object') {
        logger.warn('rateRequest missing or invalid, fallback package weight=1')
        return [{ weight: { value: 1, unit: 'pound' } }]
    }
    if (Array.isArray(rateRequest.items) && rateRequest.items.length > 0) {
        for (const item of rateRequest.items) {
            packages.push({
                weight: { value: item.weight || 1, unit: 'pound' }
            })
        }
    } else {
        packages.push({ weight: { value: 1, unit: 'pound' } })
    }
    return packages
}

async function main(params) {
    const logger = Core.Logger('shipping-methods', { level: params.LOG_LEVEL || 'info' })

    try {
        if (!params.__ow_body) {
            return singleErrorMethod('No Payload Received')
        }

        let payload
        try {
            payload = JSON.parse(atob(params.__ow_body))
        } catch (err) {
            logger.error('Failed to decode payload:', err.message)
            return singleErrorMethod('Invalid Payload Format')
        }

        const { rateRequest: request } = payload || {}
        if (!request) {
            return singleErrorMethod('Missing Rate Request')
        }

        const {
            dest_country_id: destCountryId,
            dest_postcode: destPostcode,
            dest_region_code: destRegionCode,
            dest_city: destCity,
            dest_street: destStreet
        } = request

        if (!destCountryId || !destPostcode || !destRegionCode || !destCity || !destStreet) {
            return singleErrorMethod('Missing required shipping address fields')
        }

        // 1) Load config from aio-lib-state
        const state = await stateLib.init()
        const entry = await state.get('shipstationConfig')
        let config = {}
        if (entry && entry.value) {
            config = JSON.parse(entry.value)
        }

        // Extract all fields from the config
        const shipstationApiKey = config.shipstationApiKey
        const carrierIdsStr = config.shipstationCarrierIds
        const warehouseName = config.warehouseName
        const warehousePhone = config.warehousePhone
        const warehouseAddressLine1 = config.warehouseAddressLine1
        const warehouseCityLocality = config.warehouseCityLocality
        const warehouseStateProvince = config.warehouseStateProvince
        const warehousePostalCode = config.warehousePostalCode
        const warehouseCountryCode = config.warehouseCountryCode
        const shipToName = config.shipToName || ''
        const shipToPhone = config.shipToPhone || ''

        // Validate mandatory config fields
        if (!shipstationApiKey || !carrierIdsStr) {
            return singleErrorMethod('Missing config (API Key or Carrier IDs)')
        }
        if (!warehouseName || !warehousePhone || !warehouseAddressLine1 || !warehouseCityLocality || !warehouseStateProvince || !warehousePostalCode || !warehouseCountryCode) {
            return singleErrorMethod('Missing warehouse fields in stored config')
        }

        // 2) Build the packages from rateRequest items
        const packages = buildPackages(request, logger)

        // 3) Build the ShipStation payload
        const carrierIds = carrierIdsStr.split(',').map(id => id.trim())
        const shipstationPayload = {
            shipment: {
                ship_to: {
                    name: shipToName,
                    phone: shipToPhone,
                    address_line1: destStreet,
                    city_locality: destCity,
                    state_province: destRegionCode,
                    postal_code: destPostcode,
                    country_code: destCountryId
                },
                ship_from: {
                    name: warehouseName,
                    phone: warehousePhone,
                    address_line1: warehouseAddressLine1,
                    city_locality: warehouseCityLocality,
                    state_province: warehouseStateProvince,
                    postal_code: warehousePostalCode,
                    country_code: warehouseCountryCode
                },
                packages
            },
            rate_options: {
                carrier_ids: carrierIds
            }
        }

        // 4) POST to ShipStation /v2/rates
        let rawRates = []
        try {
            const res = await fetch('https://api.shipstation.com/v2/rates', {
                method: 'POST',
                headers: {
                    'API-Key': shipstationApiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shipstationPayload)
            })

            if (!res.ok) {
                const errTxt = await res.text()
                logger.error(`ShipStation API Error (HTTP ${res.status}): ${errTxt}`)
                return singleErrorMethod('ShipStation API Error')
            }

            const data = await res.json()
            rawRates = data.rates || data.rate_response?.rates || []
        } catch (err) {
            logger.error('Network error calling ShipStation:', err.message)
            return singleErrorMethod('ShipStation Network Error')
        }

        // 5) Convert rates to JSON Patch operations
        if (rawRates.length === 0) {
            return singleErrorMethod('No Rates Available')
        }
        const usedMethodNames = {}
        const operations = rawRates.map(rate => {
            const cost = rate.shipping_amount?.amount ?? rate.shipment_cost ?? 0
            const serviceName = rate.carrier_friendly_name || rate.carrier_id || 'Carrier'
            const methodCode = rate.service_type || rate.service_code || 'unknown'

            let method = rate.service_code || methodCode
            if (usedMethodNames[method]) {
                usedMethodNames[method] += 1
                method = `${method}_${usedMethodNames[method]}`
            } else {
                usedMethodNames[method] = 1
            }

            return createShippingOperation({
                carrier_code: 'ShipStation',
                method,
                method_title: methodCode,
                price: cost,
                cost,
                additional_data: [
                    { key: 'shipstation_service', value: serviceName }
                ]
            })
        })

        return {
            statusCode: 200,
            body: JSON.stringify(operations)
        }

    } catch (err) {
        return singleErrorMethod('Server Error')
    }
}

exports.main = main
