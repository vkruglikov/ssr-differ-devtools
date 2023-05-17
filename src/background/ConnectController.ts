import { ConnectionPort, EPortName } from "../types";
import ContentConnectController from "./ContentConnectController";
import DevtoolsConnectController from "./DevtoolsConnectController";
import Tab = chrome.tabs.Tab;

export type TabsContext = Record<number, BackgroundContext>;

export type BackgroundContext = {
  [EPortName.devtoolsPanel]?: DevtoolsConnectController;
  [EPortName.content]?: ContentConnectController;
};

abstract class ConnectController<T extends ConnectionPort = ConnectionPort> {
  port?: T;
  bgCTX: BackgroundContext;
  tabsCTX: TabsContext;

  constructor(port: T, context: TabsContext) {
    this.port = port;
    this.tabsCTX = context;

    const listener: Parameters<T["onMessage"]["addListener"]>[0] = (
      ...args
    ) => {
      // @ts-expect-error Надо переписать abstract ConnectionPort
      this[args[0].action]?.(...args);
    };

    port.onMessage.addListener(listener);
    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(listener);
      this.disconnect();
    });
  }

  postMessage: T["postMessage"] = (message) => {
    this.port?.postMessage(message);
  };
  abstract disconnect(): void;
}

export default ConnectController;
