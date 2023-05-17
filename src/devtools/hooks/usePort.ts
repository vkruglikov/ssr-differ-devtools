import { DevtoolsClientConnectionPort, EPortName } from "../../types";
import { useMemo } from "react";

export const usePort = (): DevtoolsClientConnectionPort => {
  const port = useMemo(
    () =>
      chrome.runtime.connect({
        name: EPortName.devtoolsPanel,
      }) as DevtoolsClientConnectionPort,
    []
  );

  return port;
};
