import React from "react";
import styled from "styled-components";
import { Route } from "wouter";
import Host from "./pages/Host";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import MainMenu from "./pages/MainMenu";
import Play from "./pages/Play";
import Reconnect from "./pages/Reconnect";
import Rehost from "./pages/Rehost";
import Spectate from "./pages/Spectate";

const AppContainer = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  overflow-x: hidden;
  overflow-y: scroll;
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

      <Route path="/">
        <MainMenu />
      </Route>
    </AppContainer>
  );
}

export default App;
