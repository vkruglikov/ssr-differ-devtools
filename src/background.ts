import {
  ContentBgConnectionPort,
  DevtoolsBgConnectionPort,
  EPortName,
} from "./types";

import DevtoolsConnectController from "./background/DevtoolsConnectController";
import ContentConnectController from "./background/ContentConnectController";
import { BackgroundContext } from "./background/ConnectController";

const tabsCTX: Record<number, BackgroundContext> = {};

chrome.runtime.onConnect.addListener(
  (port: DevtoolsBgConnectionPort | ContentBgConnectionPort) => {
    if (port.name === EPortName.content) {
      new ContentConnectController(port, tabsCTX);
    } else if (port.name === EPortName.devtoolsPanel) {
      new DevtoolsConnectController(port, tabsCTX);
    }
  }
);
