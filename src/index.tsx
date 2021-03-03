import { ChakraProvider } from "@chakra-ui/react";
import { enableMapSet } from "immer";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

enableMapSet();

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
