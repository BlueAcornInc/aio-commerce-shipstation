// src/commerce-backend-ui-1/web-src/ShipstationConfigForm.jsx
import React, { useState, useEffect } from 'react';
import {
    Button,
    Form,
    TextField,
    Heading,
    Content,
    View
} from '@adobe/react-spectrum';

export default function ShipstationConfigForm({ actionUrl }) {
    const [apiKey, setApiKey] = useState('');
    const [carrierIds, setCarrierIds] = useState('');
    const [warehouseName, setWarehouseName] = useState('');
    const [warehousePhone, setWarehousePhone] = useState('');
    const [warehouseAddressLine1, setWarehouseAddressLine1] = useState('');
    const [warehouseCity, setWarehouseCity] = useState('');
    const [warehouseState, setWarehouseState] = useState('');
    const [warehousePostcode, setWarehousePostcode] = useState('');
    const [warehouseCountry, setWarehouseCountry] = useState('');
    const [shipToName, setShipToName] = useState('');
    const [shipToPhone, setShipToPhone] = useState('');
    const [statusMsg, setStatusMsg] = useState('Loading config...');

    useEffect(() => {
        async function loadConfig() {
            try {
                const resp = await fetch(actionUrl);
                if (!resp.ok) throw new Error(`GET failed: HTTP ${resp.status}`);
                const data = await resp.json();
                console.log('Fetched config:', data); // Debug response
                if (data.config) {
                    setApiKey(data.config.shipstationApiKey || '');
                    setCarrierIds(data.config.shipstationCarrierIds || '');
                    setWarehouseName(data.config.warehouseName || '');
                    setWarehousePhone(data.config.warehousePhone || '');
                    setWarehouseAddressLine1(data.config.warehouseAddressLine1 || '');
                    setWarehouseCity(data.config.warehouseCityLocality || '');
                    setWarehouseState(data.config.warehouseStateProvince || '');
                    setWarehousePostcode(data.config.warehousePostalCode || '');
                    setWarehouseCountry(data.config.warehouseCountryCode || '');
                    setShipToName(data.config.shipToName || '');
                    setShipToPhone(data.config.shipToPhone || '');
                }
                setStatusMsg('Config loaded successfully');
            } catch (err) {
                console.error('Fetch error:', err); // Debug error
                setStatusMsg(`Error loading config: ${err.message}`);
            }
        }
        loadConfig();
    }, [actionUrl]);

    async function handleSave() {
        const body = {
            shipstationApiKey: apiKey,
            shipstationCarrierIds: carrierIds,
            warehouseName,
            warehousePhone,
            warehouseAddressLine1,
            warehouseCityLocality: warehouseCity,
            warehouseStateProvince: warehouseState,
            warehousePostalCode: warehousePostcode,
            warehouseCountryCode: warehouseCountry,
            shipToName,
            shipToPhone
        };

        try {
            const resp = await fetch(actionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!resp.ok) throw new Error(`POST failed: HTTP ${resp.status}`);
            const result = await resp.json();
            setStatusMsg(`Saved config: ${JSON.stringify(result)}`);
        } catch (err) {
            setStatusMsg(`Error saving config: ${err.message}`);
        }
    }

    return (
        <View padding="size-250">
            <Heading level={1}>ShipStation Config Editor</Heading>
            <Content marginBottom="size-200">{statusMsg}</Content>
            <Form maxWidth="size-6000">
                <TextField
                    label="API Key"
                    value={apiKey}
                    onChange={setApiKey}
                    isRequired
                />
                <TextField
                    label="Carrier IDs (comma separated)"
                    value={carrierIds}
                    onChange={setCarrierIds}
                    isRequired
                />
                <TextField
                    label="Warehouse Name"
                    value={warehouseName}
                    onChange={setWarehouseName}
                />
                <TextField
                    label="Warehouse Phone"
                    value={warehousePhone}
                    onChange={setWarehousePhone}
                />
                <TextField
                    label="Warehouse Address"
                    value={warehouseAddressLine1}
                    onChange={setWarehouseAddressLine1}
                />
                <TextField
                    label="Warehouse City"
                    value={warehouseCity}
                    onChange={setWarehouseCity}
                />
                <TextField
                    label="Warehouse State/Province"
                    value={warehouseState}
                    onChange={setWarehouseState}
                />
                <TextField
                    label="Warehouse Postcode"
                    value={warehousePostcode}
                    onChange={setWarehousePostcode}
                />
                <TextField
                    label="Warehouse Country"
                    value={warehouseCountry}
                    onChange={setWarehouseCountry}
                />
                <TextField
                    label="Ship-To Name (optional)"
                    value={shipToName}
                    onChange={setShipToName}
                />
                <TextField
                    label="Ship-To Phone (optional)"
                    value={shipToPhone}
                    onChange={setShipToPhone}
                />
                <Button variant="accent" onPress={handleSave}>Save</Button>
            </Form>
        </View>
    );
}