import {
  DevtoolsBgConnectionPort,
  EMessage,
  EPortName,
  FindDomInContentMessage,
  InitMessage,
  MessageCallback,
} from "../types";
import ConnectController from "./ConnectController";
import Tab = chrome.tabs.Tab;

class DevtoolsConnectController<
  T extends DevtoolsBgConnectionPort = DevtoolsBgConnectionPort
> extends ConnectController<T> {
  public tabId: number;
  public tab: Tab;

  init: MessageCallback<T> = async (message: InitMessage) => {
    this.tabId = message.payload;
    this.bgCTX = this.tabsCTX[this.tabId] = this.tabsCTX[this.tabId] || {};
    this.bgCTX[EPortName.devtoolsPanel] = this;

    this.tab = await chrome.tabs.get(this.tabId);

    this.injectContentScript();
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (
        tabId === this.tab.id &&
        (changeInfo.status === "loading" || changeInfo.status === "complete")
      ) {
        this.bgCTX.devtoolsPanel?.postMessage({
          action: EMessage.tabStatus,
          payload: changeInfo.status,
        });

        if (changeInfo.status === "complete") {
          this.injectContentScript();
        }
      }
    });
  };

  private injectContentScript() {
    chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      files: ["content.js"],
    });
  }

  disconnect() {
    this.bgCTX.devtoolsPanel = undefined;
  }

  findDomInContent: MessageCallback<T> = async (
    message: FindDomInContentMessage
  ) => {
    this.bgCTX?.content?.postMessage(message);
  };
}

export default DevtoolsConnectController;
