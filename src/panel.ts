import { createRoot } from "react-dom/client";
import React from "react";
import PanelApp from "./devtools/PanelApp";

createRoot(document.getElementById("appRoot") as HTMLElement).render(
  React.createElement(PanelApp)
);
