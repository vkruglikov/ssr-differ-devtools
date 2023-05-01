import { ContentClientConnectionPort, EMessage, EPortName } from "./types";

const port = chrome.runtime.connect({
  name: EPortName.content,
}) as ContentClientConnectionPort;

port.onMessage.addListener((message) => {
  const outerHTML = document.querySelector(message.payload)?.outerHTML || "";

  port.postMessage({
    action: EMessage.findDomInContentResponse,
    payload: outerHTML,
  });
});
