import { Box } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";
import { Route } from "wouter";
import Host from "./pages/Host";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import MainMenu from "./pages/MainMenu";
import Reconnect from "./pages/Reconnect";
import Rehost from "./pages/Rehost";
import Test from "./pages/Test";

const AppContainer = styled.div`
  background-color: #282c34;
  padding-top: 50px;
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
      <Box bg="white" color="black" p={4} mb={60} minWidth={350} boxShadow="xl">
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

        <Route path="/test">
          <Test />
        </Route>

        <Route path="/">
          <MainMenu />
        </Route>
      </Box>
    </AppContainer>
  );
}

export default App;
