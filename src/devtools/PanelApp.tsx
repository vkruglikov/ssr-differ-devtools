import React, {
  FC,
  ReactEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import DiffMatchPatch from "diff-match-patch";

import styles from "./PanelApp.module.scss";
import { useHAREntries } from "./hooks/useHAREntries";
import { SelectHARRequest } from "./components/SelectHARRequest/SelectHARRequest";
import { DevtoolsClientConnectionPort, EMessage, EPortName } from "../types";
import { usePort } from "./hooks/usePort";

const dmp = new DiffMatchPatch.diff_match_patch();

const PanelApp: FC = () => {
  const port = usePort();
  const [selectedEntry, setSelectedEntry, entries] = useHAREntries();
  const [contentReady, setContentReady] = useState(false);

  const [selector, setSelector] = useState("#root");
  const [serverRender, setServerRender] = useState("");
  const [clientRender, setClientRender] = useState("");

  useEffect(() => {
    if (!contentReady) {
      setClientRender("");
      setSelectedEntry(null);
    }
  }, [contentReady]);

  useEffect(() => {
    const handleMessage: Parameters<
      DevtoolsClientConnectionPort["onMessage"]["addListener"]
    >[0] = (message) => {
      if (message.action === EMessage.findDomInContentResponse) {
        setClientRender(message.payload || "");
      } else if (message.action === EMessage.tabStatus) {
        setContentReady(message.payload === "complete");
      }
    };

    port.onMessage.addListener(handleMessage);
    port.postMessage({
      action: EMessage.init,
      payload: chrome.devtools.inspectedWindow.tabId,
    });

    return () => port.onMessage.removeListener(handleMessage);
  }, [port]);

  const findDomInContent: ReactEventHandler<HTMLButtonElement> = () => {
    port?.postMessage({
      action: EMessage.findDomInContent,
      payload: selector,
    });
  };

  useEffect(() => {
    if (selectedEntry?.getContent) {
      selectedEntry.getContent((content) => {
        const template = document.createElement("template");
        template.innerHTML = content;
        const outerHTML = template.content.querySelector(selector)?.outerHTML;

        setServerRender(outerHTML || "");
      });
    } else {
      setServerRender("");
    }
  }, [selectedEntry, selector]);

  const content = useMemo(() => {
    const diff = dmp.diff_main(serverRender, clientRender, true);
    if (diff.length > 2) {
      dmp.diff_cleanupSemantic(diff);
    }

    return dmp.diff_prettyHtml(diff);
  }, [serverRender, clientRender]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelToolbar}>
        <div className={styles.panelLeft}>
          <SelectHARRequest
            value={selectedEntry}
            options={entries}
            onChange={setSelectedEntry}
          />
        </div>
        <div className={styles.panelRight}>
          <span>Root selector:</span>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
          />
          <button onClick={findDomInContent}>Find and compare</button>
        </div>
      </div>
      <div className={styles.panelContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </div>
    </div>
  );
};

export default PanelApp;
