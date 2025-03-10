// src/commerce-backend-ui-1/web-src/ExtensionRegistration.jsx
import React, { useEffect } from "react";
import { register } from "@adobe/uix-guest";

export default function ExtensionRegistration() {
  useEffect(() => {
    // Skip registration in development
    if (process.env.NODE_ENV === "development") {
      console.log("Skipping guest registration in local development");
      return;
    }

    async function init() {
      try {
        await register({
          id: "shipstation-app"
        });
        console.log("Extension registered successfully");
      } catch (err) {
        console.error("Registration failed:", err);
      }
    }
    init();
  }, []);

  return null;
}
