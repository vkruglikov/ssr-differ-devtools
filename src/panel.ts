import { createRoot } from "react-dom/client";
import React from "react";
import PanelApp from "./devtools/PanelApp";
import { DevtoolsClientConnectionPort, EPortName } from "./types";

const clientPort = chrome.runtime.connect({
  name: EPortName.devtoolsPanel,
}) as DevtoolsClientConnectionPort;

createRoot(document.getElementById("appRoot") as HTMLElement).render(
  React.createElement(PanelApp, {
    port: clientPort,
  })
);
