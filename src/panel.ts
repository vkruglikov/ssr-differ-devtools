const isFirstRequestPredicate = (request: chrome.devtools.network.Request) =>
  request.response.content.mimeType === "text/html" &&
  request._resourceType === "document" &&
  // @ts-expect-error
  request._initiator.type === "other";

chrome.devtools.network.onNavigated.addListener(() => {
  console.log("Новая страница");
  chrome.devtools.network.getHAR((harLog) => {
    console.log("harLog", harLog);
  });
});

chrome.devtools.network.getHAR((harLog) => {
  console.log("harLog", harLog.entries.filter(isFirstRequestPredicate));
});

chrome.devtools.network.onRequestFinished.addListener((request) => {
  if (isFirstRequestPredicate(request)) {
    console.log("-----------", request, request.request.url);
  }
});
