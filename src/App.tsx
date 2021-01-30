import React from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";

function App() {
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
      <Box bg="tomato" color="black" p={4}>
        Hello!
      </Box>
    </AppContainer>
  );
}

export default App;
