import { StarIcon } from "@chakra-ui/icons";
import { Text, Tooltip } from "@chakra-ui/react";
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
      <Text
        position="relative"
        color={`${rankColor}.600`}
        bg={`${rankColor}.100`}
        borderWidth={1}
        borderColor={`${rankColor}.500`}
        fontWeight={"bold"}
        textAlign={"center"}
        w={8}
        _hover={{ cursor: "default" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {hasHandBonus && (
          <StarIcon
            position="absolute"
            color="yellow.400"
            right={0}
            transform="translate(50%, -50%)"
            w="13px"
            h="13px"
          />
        )}
        {rank}
      </Text>
    </Tooltip>
  );
}

export default Rank;
