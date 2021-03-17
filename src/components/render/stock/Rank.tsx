import { StarIcon } from "@chakra-ui/icons";
import { Box, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  rank: number;
  handDescription?: string;
  hasHandBonus: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function Rank({
  rank,
  handDescription,
  hasHandBonus,
  onMouseEnter,
  onMouseLeave,
}: PropTypes) {
  const rankColor = rank > 3 ? "red" : "green";

  return (
    <Tooltip label={handDescription || " - "} aria-label="Hand ranking">
      <Box
        position="relative"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={`${rankColor}.100`}
        borderWidth={1}
        borderColor={`${rankColor}.500`}
        boxSize={8}
        _hover={{ cursor: "default" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {hasHandBonus && (
          <StarIcon
            position="absolute"
            color="yellow.400"
            right={0}
            top={0}
            transform="translate(50%, -50%)"
            w="13px"
            h="13px"
          />
        )}
        <Text color={`${rankColor}.600`} fontWeight={"bold"}>
          {rank}
        </Text>
      </Box>
    </Tooltip>
  );
}

export default Rank;
