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
  initialRoomCode: string;
  isSubmitting?: boolean;
  onSubmit?: (roomCode: string) => void;
};

function ReconnectForm({
  initialRoomCode,
  isSubmitting = false,
  onSubmit,
}: PropTypes) {
  // State
  const [roomCode, setRoomCode] = useState(initialRoomCode);

  // Handlers
  const handleRoomCodeChange = (roomCode: string) => {
    setRoomCode(roomCode.toUpperCase());
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(roomCode);
    }
  };

  // Render
  return (
    <>
      <FormControl id="room-code" mb={5}>
        <FormLabel>Room Code:</FormLabel>
        <HStack justifyContent="space-between">
          <PinInput
            type="alphanumeric"
            value={roomCode}
            onChange={handleRoomCodeChange}
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
      </FormControl>

      <Button
        colorScheme="blue"
        w="100%"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Connecting"
        variant={isSubmitting ? "outline" : "solid"}
      >
        Reconnect
      </Button>
    </>
  );
}

export default ReconnectForm;
