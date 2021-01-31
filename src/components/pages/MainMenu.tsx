import React from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";
import { Link as RouterLink, Route } from "wouter";

function MainMenu() {
  return (
    <Stack spacing={4}>
      <Button colorScheme="green" href="/host" as={RouterLink}>
        Host Game
      </Button>
      <Divider />
      <Button colorScheme="blue" href="/join" as={RouterLink}>
        Join Game
      </Button>
    </Stack>
  );
}

export default MainMenu;
