import { useEffect, useState } from "react";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Request = chrome.devtools.network.Request;
type HAREntry = ArrayElement<chrome.devtools.network.HARLog["entries"]>;

const isFirstRequestPredicate = (request: Request) =>
  request.response.content.mimeType === "text/html" &&
  request.response.status >= 200 &&
  request.response.status < 300 &&
  request._resourceType === "document";

const getHAREntries = () =>
  new Promise<HAREntry[]>((resolve) => {
    chrome.devtools.network.getHAR((harLog) => {
      resolve(harLog.entries.filter(isFirstRequestPredicate));
    });
  });

export const useHAREntries = () => {
  const [selected, setSelected] = useState<Request | null>(null);
  const [harLogEntries, setHarLogEntries] = useState<Request[]>([]);

  useEffect(() => {
    const handleNavigate = () =>
      getHAREntries()
        .then((items) => {
          setHarLogEntries(items as Request[]);
        })
        .then(() => setSelected(null));
    const handleRequestFinished = (request: Request) => {
      if (isFirstRequestPredicate(request)) {
        setHarLogEntries((preventState) =>
          preventState.indexOf(request) === 0
            ? [...preventState, request]
            : preventState
        );
      }
    };

    chrome.devtools.network.onNavigated.addListener(handleNavigate);
    chrome.devtools.network.onRequestFinished.addListener(
      handleRequestFinished
    );

    return () => {
      chrome.devtools.network.onNavigated.removeListener(handleNavigate);
      chrome.devtools.network.onRequestFinished.removeListener(
        handleRequestFinished
      );
    };
  }, []);

  return [selected, setSelected, harLogEntries] as const;
};
