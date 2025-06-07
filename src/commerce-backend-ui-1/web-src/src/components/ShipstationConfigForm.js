import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  TextField,
  Content,
  View,
  Picker,
  Item,
  Heading,
  Grid,
  Text
} from "@adobe/react-spectrum";

const DEBUG = false; // Set to true for detailed error messages



export default function ShipstationConfigForm({ actionUrl }) {
    const [apiKey, setApiKey] = useState("");
  const [carrierIds, setCarrierIds] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [warehousePhone, setWarehousePhone] = useState("");
  const [warehouseAddressLine1, setWarehouseAddressLine1] = useState("");
  const [warehouseCity, setWarehouseCity] = useState("");
  const [warehouseState, setWarehouseState] = useState("");
  const [warehousePostcode, setWarehousePostcode] = useState("");
  const [warehouseCountry, setWarehouseCountry] = useState("");
  const [shipToName, setShipToName] = useState("");
  const [shipToPhone, setShipToPhone] = useState("");
  const [statusMsg, setStatusMsg] = useState("Loading config...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const resp = await fetch(actionUrl);
        if (!resp.ok) throw new Error(`GET failed: HTTP ${resp.status}`);
        const data = await resp.json();
        console.log("Fetched config:", data); // Debug response
        if (data.config) {
          setApiKey(data.config.shipstationApiKey || "");
          setCarrierIds(data.config.shipstationCarrierIds || "");
          setWarehouseName(data.config.warehouseName || "");
          setWarehousePhone(data.config.warehousePhone || "");
          setWarehouseAddressLine1(data.config.warehouseAddressLine1 || "");
          setWarehouseCity(data.config.warehouseCityLocality || "");
          setWarehouseState(data.config.warehouseStateProvince || "");
          setWarehousePostcode(data.config.warehousePostalCode || "");
          setWarehouseCountry(data.config.warehouseCountryCode || "");
          setShipToName(data.config.shipToName || "");
          setShipToPhone(data.config.shipToPhone || "");
        }
        setStatusMsg("Config loaded successfully");
        setHasError(false);
      } catch (err) {
        setHasError(true);
        if (DEBUG) {
        setStatusMsg(`Error loading config: ${err.message}`);
        } else {
          setStatusMsg("");
          console.log("Error loading config:", err);
      }
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
      shipToPhone,
    };
    try {
      const resp = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`POST failed: HTTP ${resp.status}`);
      setStatusMsg(`Configuration saved successfully`);
      setHasError(false);
    } catch (err) {
      setHasError(true);
      if (DEBUG) {
      setStatusMsg(`Error saving config: ${err.message}`);
      } else {
        setStatusMsg("");
        console.error("Error saving config:", err);
    }
  }
  }

const links = [
    { label: 'Blue Acorn iCi', url: 'https://blueacornici.com/' },
    { label: 'Create an Issue', url: 'https://github.com/BlueAcornInc/aio-commerce-yotpo/issues/new' },
    { label: 'Issue Tracker', url: 'https://github.com/BlueAcornInc/aio-commerce-yotpo/issues' },
    { label: 'Contact Us', url: 'apps@blueacornici.com' },
    { label: 'Documentation', url: 'https://apps.blueacornici.shop/' },
]

  return (
    <View padding="size-250">
        {DEBUG && statusMsg && (
            <Content marginBottom="size-200" UNSAFE_style={{ color: "#d2691e" }}>
                {statusMsg}
            </Content>
        )}

      <Form maxWidth="size-6000">

            <Heading level={3}>Storefront Blocks</Heading>

                <Content>
                    Yotpo must also be configured in the Adobe Commerce Storefront configs.json.<br /><br />
                </Content>

            <Heading level={3}>General Settings</Heading>

        <TextField
          label="API Key"
          value={apiKey}
          onChange={setApiKey}
          isRequired
          isDisabled={hasError}
        />
        <TextField
          label="Carrier IDs (comma separated)"
          value={carrierIds}
          onChange={setCarrierIds}
          isRequired
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Name"
          value={warehouseName}
          onChange={setWarehouseName}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Phone"
          value={warehousePhone}
          onChange={setWarehousePhone}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Address"
          value={warehouseAddressLine1}
          onChange={setWarehouseAddressLine1}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse City"
          value={warehouseCity}
          onChange={setWarehouseCity}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse State/Province"
          value={warehouseState}
          onChange={setWarehouseState}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Postcode"
          value={warehousePostcode}
          onChange={setWarehousePostcode}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Country"
          value={warehouseCountry}
          onChange={setWarehouseCountry}
          isDisabled={hasError}
        />
        <TextField
          label="Ship-To Name (optional)"
          value={shipToName}
          onChange={setShipToName}
          isDisabled={hasError}
        />
        <TextField
          label="Ship-To Phone (optional)"
          value={shipToPhone}
          onChange={setShipToPhone}
          isDisabled={hasError}
        />
        <Button variant="accent" onPress={handleSave} isDisabled={hasError}>
          Save
        </Button>
            

            {hasError && (
                <Content UNSAFE_style={{ color: "#b0b0b0" }}>
                    <br />Secure configuration management is not yet supported. Please manage any setting with environment variables.
                </Content>
            )}

            <br /><br />
            <Heading level={3}>Support</Heading>
            <Grid
                columns={['1fr 1fr']}
                gap="size-200"
                width="size-3600"
            >
                {links.map(link => (
                    <View
                        key={link.url}
                        borderWidth="thin"
                        borderColor="dark"
                        padding="size-200"
                        borderRadius="medium"
                        onClick={() => {
                            window.parent.postMessage({ type: 'open-link', url: link.url }, '*');
                        }}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                    >
                        <Text><b>{link.label}</b>: {link.url}</Text>
                    </View>
                ))}
            </Grid>
      </Form>
    </View>
  );
}
