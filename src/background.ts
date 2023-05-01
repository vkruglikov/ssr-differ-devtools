import {
  ContentBgConnectionPort,
  DevtoolsBgConnectionPort,
  EPortName,
} from "./types";
import DevtoolsConnectController from "./background/DevtoolsConnectController";
import ContentConnectController from "./background/ContentConnectController";
import { BackgroundContext } from "./background/ConnectController";

const backgroundCTX: BackgroundContext = {};

chrome.runtime.onConnect.addListener(
  (port: DevtoolsBgConnectionPort | ContentBgConnectionPort) => {
    if (port.name === EPortName.devtoolsPanel) {
      backgroundCTX.devtoolsPanel = new DevtoolsConnectController(
        port,
        backgroundCTX
      );
    } else if (port.name === EPortName.content) {
      backgroundCTX.content = new ContentConnectController(port, backgroundCTX);
    }
  }
);
