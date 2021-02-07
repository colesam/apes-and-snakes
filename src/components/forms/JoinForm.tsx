import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

type PropTypes = {
  isSubmitting: boolean;
  nameTakenError: boolean;
  onSubmit: (roomCode: string, name: string) => void;
};

function JoinForm({ isSubmitting, nameTakenError, onSubmit }: PropTypes) {
  // State
  const nameInput = useRef<HTMLInputElement>(null);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  // Handlers
  const handleRoomCodeChange = (roomCode: string) => {
    setRoomCode(roomCode.toUpperCase());
  };

  const handleRoomCodeComplete = () => {
    nameInput.current?.focus();
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(roomCode, name);
    }
  };

  // Render
  return (
    <>
      <Stack direction="column" spacing={3} mb={5}>
        <FormControl id="room-code">
          <FormLabel>Room Code:</FormLabel>
          <HStack justifyContent="space-between">
            <PinInput
              type="alphanumeric"
              value={roomCode}
              onChange={handleRoomCodeChange}
              onComplete={handleRoomCodeComplete}
              isDisabled={nameTakenError}
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </FormControl>

        <FormControl id="name">
          <FormLabel>Name:</FormLabel>
          <Input
            placeholder="Name"
            isInvalid={nameTakenError}
            errorBorderColor="crimson"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
            id="name"
            key="name"
            ref={nameInput}
          />
          {nameTakenError && (
            <Text fontSize="sm" color="crimson">
              This name is already taken.
            </Text>
          )}
        </FormControl>
      </Stack>

      <Button
        colorScheme="blue"
        w="100%"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Connecting"
        variant={isSubmitting ? "outline" : "solid"}
        isDisabled={name.length < 3}
      >
        Connect
      </Button>
    </>
  );
}

export default JoinForm;
