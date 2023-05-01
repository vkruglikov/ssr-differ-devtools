import {
  ContentBgConnectionPort,
  FindDomInContentResponseMessage,
  MessageCallback,
} from "../types";
import ConnectController from "./ConnectController";

class ContentConnectController<
  T extends ContentBgConnectionPort = ContentBgConnectionPort
> extends ConnectController<T> {
  findDomInContentResponse: MessageCallback<T> = (
    message: FindDomInContentResponseMessage
  ) => {
    this.bgCTX?.devtoolsPanel?.postMessage(message);
  };
}

export default ContentConnectController;
