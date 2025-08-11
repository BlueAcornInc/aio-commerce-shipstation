import { useState, useEffect } from "react";
import { callAction } from "../utils";

/**
 *
 * @param props
 * @param setFormState
 */
export function useShipStationConfigLoader(props, setFormState) {
  const [statusMsg, setStatusMsg] = useState("Loading config...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    /**
     *
     */
    async function loadConfig() {
      try {
        const data = await callAction(props, "shipstation/admin-config", "GET");
        if (data) {
          setFormState((prevState) => ({ ...prevState, ...data.config }));
        }
        setStatusMsg("Config loaded successfully");
        setHasError(false);
      } catch (err) {
        setHasError(true);
        setStatusMsg(`Error loading config: ${err.message}`);
        console.error("Error loading config:", err);
      }
    }
    loadConfig();
  }, [props, setFormState]);

  return { statusMsg, hasError };
}

/**
 *
 * @param props
 */
export function useShipStationConfigSaver(props) {
  const [statusMsg, setStatusMsg] = useState("");
  const [hasError, setHasError] = useState(false);

  /**
   *
   * @param config
   */
  async function saveConfig(config) {
    try {
      await callAction(props, "shipstation/admin-config", "POST", config);
      setStatusMsg("Configuration saved successfully");
      setHasError(false);
    } catch (err) {
      setHasError(true);
      setStatusMsg(`Error saving config: ${err.message}`);
      console.error("Error saving config:", err);
    }
  }

  return { saveConfig, statusMsg, hasError };
}
