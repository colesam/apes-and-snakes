import React, { useState } from "react";
import styled from "styled-components";
import { Text, Box, Flex, Input, Button, Stack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import PeerConnectionManager from "./peer/PeerConnectionManager";
import JoinForm from "./forms/JoinForm";

/**
 * TODO:
 * - Create input for setting own peer id, register as peer under roomCode::myPeerId
 * - Create input for connecting to other peer, roomCode::myPeerId
 * - OPTIONAL: store in localStorage if it's getting annoying to re-enter every refresh
 * - Get a button to switch from green -> blue -> green when either client presses it
 */

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
      <Box bg="white" color="black" p={4} mb={60} w={275}>
        {connected && (
          <Flex
            display="flex"
            align="center"
            justify="space-between"
            bg="green.500"
            px={3}
            mb={1}
            fontSize="lg"
            color="white"
          >
            <Text>Connected</Text> <CheckCircleIcon />
          </Flex>
        )}

        {!connected && (
          <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />
        )}
      </Box>
    </AppContainer>
  );
}

export default App;
