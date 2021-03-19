import { Box, Flex, Text } from "@chakra-ui/react";
import moize from "moize";
import React from "react";
import Volume from "./Volume";

type PropTypes = {
  buyVolume: number;
  sellVolume: number;
};

function VolumeSection({ buyVolume, sellVolume }: PropTypes) {
  return (
    <Flex justify="space-between">
      <Box w="48%">
        <Text fontWeight="bold" fontSize="sm">
          Buy Volume:
        </Text>
        <Volume volume={buyVolume} />
      </Box>
      <Box w="48%">
        <Text fontWeight="bold" fontSize="sm">
          Sell Volume:
        </Text>
        <Volume volume={sellVolume} />
      </Box>
    </Flex>
  );
}

export default moize(VolumeSection, {
  isReact: true,
  profileName: "<VolumeSection />",
});
