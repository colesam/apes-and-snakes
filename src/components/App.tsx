import React from "react";
import { hot } from "react-hot-loader";
import styled from "styled-components";
import { Route } from "wouter";
import { HMR_ENABLED } from "../config";
import Host from "./pages/Host";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import MainMenu from "./pages/MainMenu";
import Play from "./pages/Play";
import Reconnect from "./pages/Reconnect";
import Rehost from "./pages/Rehost";
import Spectate from "./pages/Spectate";
import Test from "./pages/Test";

const AppContainer = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <Route path="/host">
        <Host />
      </Route>

      <Route path="/rehost">
        <Rehost />
      </Route>

      <Route path="/join">
        <Join />
      </Route>

      <Route path="/reconnect">
        <Reconnect />
      </Route>

      <Route path="/lobby">
        <Lobby />
      </Route>

      <Route path="/play">
        <Play />
      </Route>

      <Route path="/spectate">
        <Spectate />
      </Route>

      <Route path="/test">
        <Test />
      </Route>

      <Route path="/">
        <MainMenu />
      </Route>
    </AppContainer>
  );
}

export default HMR_ENABLED ? hot(module)(App) : App;
