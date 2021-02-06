import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

type PropTypes = {
  isSubmitting?: boolean;
  onSubmit?: (roomCode: string, name: string) => void;
};

function JoinForm({ isSubmitting = false, onSubmit }: PropTypes) {
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
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
            id="name"
            key="name"
            ref={nameInput}
          />
        </FormControl>
      </Stack>

      <Button
        colorScheme="blue"
        w="100%"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Connecting"
        variant={isSubmitting ? "outline" : "solid"}
      >
        Connect
      </Button>
    </>
  );
}

export default JoinForm;
