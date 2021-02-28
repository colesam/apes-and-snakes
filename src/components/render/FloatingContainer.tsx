import { Box } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  children: JSX.Element;
};

function FloatingContainer({ children }: PropTypes) {
  return (
    <Box bg="white" color="black" p={4} minWidth={350} boxShadow="xl">
      {children}
    </Box>
  );
}

export default FloatingContainer;
