import { Text, Box, HStack, HTMLChakraProps, Flex } from "@chakra-ui/react";
import { first, reverse } from "lodash";
import React from "react";
import { EXPECTED_FLOP_LIFETIME } from "../../config";
import { Card } from "../../core/card/Card";
import { useStore } from "../../store/store";
import CardRender from "../render/Card";
import CardStack from "../render/CardStack";

function FlopDisplay(styleProps: HTMLChakraProps<"div">) {
  const flop = useStore(s => s.flop);
  const highlightCards = useStore(s => s.highlightCards);
  const retiredCard = useStore(s => s.retiredCard);
  const flopAgeDesc = useStore(s => {
    const age = s.tick - s.flopSetAt;
    const ageLifetimeRatio = age / EXPECTED_FLOP_LIFETIME;
    if (ageLifetimeRatio > 1) {
      return "overdue";
    }
    if (ageLifetimeRatio > 0.75) {
      return "getting old";
    }
    if (ageLifetimeRatio > 0.5) {
      return "mature";
    }
    if (ageLifetimeRatio > 0.2) {
      return "young";
    }
    return "brand-new";
  });

  const reversedCards = reverse([...flop.cards]);
  const blankCard = new Card();

  return (
    <Flex fullWidth justify={"center"} {...styleProps}>
      <Box p={2} pt={5} px={4} borderWidth={1} bg={"gray.100"}>
        <HStack align="center" spacing={4} mb={4}>
          <CardRender card={blankCard} />
          <CardStack
            cards={reversedCards}
            highlightCards={highlightCards}
            alertCards={
              flopAgeDesc === "brand-new" ? [first(reversedCards)!] : []
            }
            cardScale={1.4}
            spacing={8}
          />
          <CardRender card={retiredCard} opacity={0.4} />
        </HStack>
        <Text m={0} textAlign={"center"} fontSize={"sm"}>
          <em>Flop is {flopAgeDesc}</em>
        </Text>
      </Box>
    </Flex>
  );
}

export default FlopDisplay;
