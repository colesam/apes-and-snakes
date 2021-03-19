import { ChakraProvider } from "@chakra-ui/react";
import { enableMapSet, enablePatches, setAutoFreeze } from "immer";
import LogRocket from "logrocket";
import moize from "moize";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { logDebug } from "./util/log";

const { REACT_APP_LOG_ROCKET_ENABLED, REACT_APP_LOG_ROCKET_KEY } = process.env;

enableMapSet();
enablePatches();
setAutoFreeze(true);

moize.collectStats();

// @ts-ignore
window.__memoStats__ = moize.getStats;
// @ts-ignore
window.__clearStats__ = moize.clearStats;

if (REACT_APP_LOG_ROCKET_ENABLED === "true") {
  logDebug("Enabled LogRocket logging.");
  // @ts-ignore
  LogRocket.init(REACT_APP_LOG_ROCKET_KEY);
}

ReactDOM.render(
  <ChakraProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);

// initStoreInterval(2000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
