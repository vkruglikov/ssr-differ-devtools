import {
  DevtoolsBgConnectionPort,
  FindDomInContentMessage,
  MessageCallback,
} from "../types";
import ConnectController from "./ConnectController";

class DevtoolsConnectController<
  T extends DevtoolsBgConnectionPort = DevtoolsBgConnectionPort
> extends ConnectController<T> {
  constructor(...args: ConstructorParameters<typeof ConnectController<T>>) {
    super(...args);

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs[0].id) return;

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    });
  }

  findDomInContent: MessageCallback<T> = (message: FindDomInContentMessage) => {
    this.bgCTX?.content?.postMessage(message);
  };
}

export default DevtoolsConnectController;
