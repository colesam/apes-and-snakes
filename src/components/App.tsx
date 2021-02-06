import React from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { Route } from "wouter";
import MainMenu from "./pages/MainMenu";
import Host from "./pages/Host";
import Rehost from "./pages/Rehost";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import Reconnect from "./pages/Reconnect";

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
      <Box bg="white" color="black" p={4} mb={60} w={275} boxShadow="xl">
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

        <Route path="/">
          <MainMenu />
        </Route>
      </Box>
    </AppContainer>
  );
}

export default App;
