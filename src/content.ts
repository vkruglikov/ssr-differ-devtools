class ReactHydrateDevTools {
  constructor() {
    const reactRootHTML = document.getElementById("root").outerHTML;

    console.log(reactRootHTML);
  }
}

declare global {
  interface Window {
    __REACT_HYDRATE_DEVTOOLS?: ReactHydrateDevTools;
  }
}

window.__REACT_HYDRATE_DEVTOOLS = new ReactHydrateDevTools();

export {};
