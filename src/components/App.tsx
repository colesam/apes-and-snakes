import React, { useState } from "react";
import styled from "styled-components";
import { Box, Button, Divider, Stack } from "@chakra-ui/react";
import { Link as RouterLink, Route } from "wouter";
import PeerConnectionManager from "./peer/PeerConnectionManager";
import MainMenu from "./pages/MainMenu";
import Host from "./pages/Host";
import Join from "./pages/Join";

const namespace = "sfqxWNtbOKrs45NDDZRvOaP4vAApMTc1";

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
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (roomCode: string, name: string) => {
    setIsConnecting(true);
    PeerConnectionManager.register(`${namespace} ${roomCode} ${name}`)
      .then(() => {
        setConnected(true);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsConnecting(false));
  };

  return (
    <AppContainer>
      <Box bg="white" color="black" p={4} mb={60} w={275} boxShadow="xl">
        <Route path="/host">
          <Host />
        </Route>

        <Route path="/join">
          <Join />
        </Route>

        <Route path="/">
          <MainMenu />
        </Route>
      </Box>
    </AppContainer>
  );
}

export default App;
