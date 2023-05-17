import {
  ContentBgConnectionPort,
  EPortName,
  FindDomInContentResponseMessage,
  MessageCallback,
} from "../types";
import ConnectController from "./ConnectController";

class ContentConnectController<
  T extends ContentBgConnectionPort = ContentBgConnectionPort
> extends ConnectController<T> {
  tabId: number;
  constructor(...args: ConstructorParameters<typeof ConnectController<T>>) {
    super(...args);

    if (this.port?.sender?.tab?.id && this.tabsCTX[this.port.sender.tab.id]) {
      this.tabId = this.port.sender.tab.id;
      this.bgCTX = this.tabsCTX[this.tabId] = this.tabsCTX[this.tabId] || {};
      this.bgCTX[EPortName.content] = this;
    }
  }

  disconnect() {
    this.tabsCTX[this.tabId][EPortName.content] = undefined;
  }

  findDomInContentResponse: MessageCallback<T> = (
    message: FindDomInContentResponseMessage
  ) => {
    this.bgCTX?.devtoolsPanel?.postMessage(message);
  };
}

export default ContentConnectController;
