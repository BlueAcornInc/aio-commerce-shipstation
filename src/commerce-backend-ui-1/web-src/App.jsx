// src/commerce-backend-ui-1/web-src/App.jsx
import React from "react";
import { Provider } from "@react-spectrum/provider";
import { theme } from "@react-spectrum/theme-default";
import ShipstationConfigForm from "./ShipstationConfigForm.jsx";
import ExtensionRegistration from "./ExtensionRegistration.jsx";
import ReactDOM from "react-dom";

export default function App() {

  const namespace =
    (typeof process !== "undefined" && process.env.__OW_NAMESPACE) ||
    "35582-shipstation-stage";
  const appName = "aio-commerce-shipstation-app";
  const ACTION_URL = `/api/v1/web/${appName}/shipstation-config`;
  console.log("ACTION_URL:", ACTION_URL);
            return (
    <Provider theme={theme} colorScheme="light">
      <ExtensionRegistration />
      <ShipstationConfigForm actionUrl={ACTION_URL} />
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
