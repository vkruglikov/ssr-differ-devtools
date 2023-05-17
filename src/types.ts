import Port = chrome.runtime.Port;
import PortMessageEvent = chrome.runtime.PortMessageEvent;

export enum EMessage {
  init = "init",
  findDomInContent = "findDomInContent",
  findDomInContentResponse = "findDomInContentResponse",
  tabStatus = "tabStatus",
}
export enum EPortName {
  devtoolsPanel = "devtoolsPanel",
  content = "content",
}

type Message<T extends EMessage = EMessage, P = unknown> = {
  action: T;
  payload: P;
};

export type FindDomInContentMessage = Message<
  EMessage.findDomInContent,
  string
>;
export type FindDomInContentResponseMessage = Message<
  EMessage.findDomInContentResponse,
  string
>;
export type TabStatusMessage = Message<
  EMessage.tabStatus,
  "loading" | "complete" | "unloaded"
>;
export type InitMessage = Message<EMessage.init, number>;

export type ConnectionPort<
  N extends EPortName = EPortName,
  PM extends Message = Message,
  OM extends Message = Message
> = {
  name: N;
  postMessage: (message: PM) => void;
  onMessage: {
    addListener: (callback: (message: OM, sender: Port) => void) => void;
  } & Omit<PortMessageEvent, "addListener">;
} & Omit<Port, "postMessage" | "name" | "onMessage">;

export type MessageCallback<T extends ConnectionPort> = Parameters<
  T["onMessage"]["addListener"]
>[0];

export type DevtoolsBgConnectionPort = ConnectionPort<
  EPortName.devtoolsPanel,
  FindDomInContentResponseMessage | TabStatusMessage,
  FindDomInContentMessage | InitMessage
>;

export type ContentBgConnectionPort = ConnectionPort<
  EPortName.content,
  FindDomInContentMessage,
  FindDomInContentResponseMessage
>;

export type DevtoolsClientConnectionPort = ConnectionPort<
  EPortName.devtoolsPanel,
  FindDomInContentMessage | InitMessage,
  FindDomInContentResponseMessage | TabStatusMessage
>;

export type ContentClientConnectionPort = ConnectionPort<
  EPortName.content,
  FindDomInContentResponseMessage,
  FindDomInContentMessage
>;
