import { ConnectionPort, EPortName } from "../types";
import ContentConnectController from "./ContentConnectController";
import DevtoolsConnectController from "./DevtoolsConnectController";

export type BackgroundContext = {
  [EPortName.devtoolsPanel]?: DevtoolsConnectController;
  [EPortName.content]?: ContentConnectController;
};

abstract class ConnectController<T extends ConnectionPort> {
  port?: T;
  bgCTX: BackgroundContext;

  constructor(port: T, context: BackgroundContext) {
    this.port = port;
    this.bgCTX = context;

    port.onMessage.addListener((...args) => {
      // @ts-expect-error Надо переписать abstract ConnectionPort
      this[args[0].action]?.(...args);
    });
    port.onDisconnect.addListener(() => {
      console.log("disconnect", port.name);
    });
  }

  postMessage: T["postMessage"] = (message) => {
    this.port?.postMessage(message);
  };
}

export default ConnectController;
