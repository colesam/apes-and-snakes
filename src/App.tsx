import React, { useState } from "react";
import Peer from "peerjs";
import styled from "styled-components";
import {
  Text,
  Box,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import PeerConnectionManager from "./peer/PeerConnectionManager";

/**
 * TODO:
 * - Create input for setting own peer id, register as peer under roomCode::myPeerId
 * - Create input for connecting to other peer, roomCode::myPeerId
 * - OPTIONAL: store in localStorage if it's getting annoying to re-enter every refresh
 * - Get a button to switch from green -> blue -> green when either client presses it
 */

const roomCode = "sfqxWNtbOKrs45NDDZRvOaP4vAApMTc1";

function App() {
  const [connected, setConnected] = useState(false);
  const [pin, setPin] = useState("");

  function handlePinComplete(p: string) {
    setPin(p);
    PeerConnectionManager.register(`${roomCode}::${p}`).then(() =>
      setConnected(true)
    );
  }

  const AppContainer = styled.div`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  `;

  return (
    <AppContainer>
      <Box bg="white" color="black" p={4}>
        <Text m={0}>
          {pin ? `Your PIN is: ${pin}` : "You do not have a PIN"}
        </Text>
        <Divider my={3} />
        {pin && (
          <Flex display="flex" align="center" justify="space-between">
            <Text>Connected</Text> <CheckCircleIcon color="green.500" />
          </Flex>
        )}
        {!pin && (
          <HStack>
            <PinInput
              type="alphanumeric"
              size="sm"
              onComplete={handlePinComplete}
              autoFocus
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        )}
      </Box>
    </AppContainer>
  );
}

export default App;
