import React, { useState } from "react";
import {
  Button,
  Form,
  TextField,
  Heading,
  Content,
  View,
  Grid,
  Text,
} from "@adobe/react-spectrum";
import {
  useShipStationConfigLoader,
  useShipStationConfigSaver,
} from "../hooks/useShipStationConfig";

const DEBUG = false;

/**
 *
 * @param props
 */
export default function ShipstationConfigForm(props) {
  const [formState, setFormState] = useState({
    shipstationApiKey: "",
    shipstationCarrierIds: "",
    warehouseName: "",
    warehousePhone: "",
    warehouseAddressLine1: "",
    warehouseCityLocality: "",
    warehouseStateProvince: "",
    warehousePostalCode: "",
    warehouseCountryCode: "",
    shipToName: "",
    shipToPhone: "",
  });

  const { statusMsg: loadStatusMsg, hasError: loadHasError } =
    useShipStationConfigLoader(props, setFormState);

  const {
    saveConfig,
    statusMsg: saveStatusMsg,
    hasError: saveHasError,
  } = useShipStationConfigSaver(props);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    saveConfig(formState);
  };

  const links = [
    { label: "Blue Acorn iCi", url: "https://blueacornici.com/" },
    {
      label: "Create an Issue",
      url: "https://github.com/BlueAcornInc/aio-commerce-shipstation/issues/new",
    },
    {
      label: "Issue Tracker",
      url: "https://github.com/BlueAcornInc/aio-commerce-shipstation/issues",
    },
    { label: "Contact Us", url: "apps@blueacornici.com" },
    { label: "Documentation", url: "https://apps.blueacornici.shop/" },
  ];

  return (
    <View padding="size-250">
      {DEBUG && statusMsg && (
        <Content marginBottom="size-200" UNSAFE_style={{ color: "#d2691e" }}>
          {statusMsg}
        </Content>
      )}
      <Form maxWidth="size-6000">
        <Heading level={3} marginTop="size-200" marginBottom="size-100">
          General Configuration
        </Heading>

        <TextField
          label="API Key"
          value={formState.apiKey}
          onChange={(val) => handleChange("apiKey", val)}
          isRequired
          isDisabled={hasError}
        />
        <TextField
          label="Carrier IDs (comma separated)"
          value={formState.carrierIds}
          onChange={(val) => handleChange("carrierIds", val)}
          isRequired
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Name"
          value={formState.warehouseName}
          onChange={(val) => handleChange("warehouseName", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Phone"
          value={formState.warehousePhone}
          onChange={(val) => handleChange("warehousePhone", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Address"
          value={formState.warehouseAddressLine1}
          onChange={(val) => handleChange("warehouseAddressLine1", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse City"
          value={formState.warehouseCity}
          onChange={(val) => handleChange("warehouseCity", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse State/Province"
          value={formState.warehouseState}
          onChange={(val) => handleChange("warehouseState", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Postcode"
          value={formState.warehousePostcode}
          onChange={(val) => handleChange("warehousePostcode", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Warehouse Country"
          value={formState.warehouseCountry}
          onChange={(val) => handleChange("warehouseCountry", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Ship-To Name (optional)"
          value={formState.shipToName}
          onChange={(val) => handleChange("shipToName", val)}
          isDisabled={hasError}
        />
        <TextField
          label="Ship-To Phone (optional)"
          value={formState.shipToPhone}
          onChange={(val) => handleChange("shipToPhone", val)}
          isDisabled={hasError}
        />

        <Button variant="accent" onPress={handleSave} isDisabled={hasError}>
          Save
        </Button>

        {saveHasError && (
          <Content UNSAFE_style={{ color: "#b0b0b0" }}>
            <br />
            {saveStatusMsg}
          </Content>
        )}

        <br />
        <br />
        <Heading level={3}>Support</Heading>
        <Grid columns={["1fr 1fr"]} gap="size-200" width="size-3600">
          {links.map((link) => (
            <View
              key={link.url}
              borderWidth="thin"
              borderColor="dark"
              padding="size-200"
              borderRadius="medium"
              onClick={() => {
                window.parent.postMessage(
                  { type: "open-link", url: link.url },
                  "*",
                );
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <Text>
                <b>{link.label}</b>: {link.url}
              </Text>
            </View>
          ))}
        </Grid>
      </Form>
    </View>
  );
}
