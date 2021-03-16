import { HStack, HTMLChakraProps } from "@chakra-ui/react";
import { first, reverse } from "lodash";
import React from "react";
import { Card } from "../../core/card/Card";
import { useStore } from "../../store/store";
import CardRender from "../render/Card";
import CardStack from "../render/CardStack";

interface PropTypes extends HTMLChakraProps<"div"> {
  spacing?: number;
}

function FlopDisplay(styleProps: PropTypes) {
  const flop = useStore(s => s.flop);
  const highlightCards = useStore(s => s.highlightCards);
  const retiredCard = useStore(s => s.retiredCard);
  const flopAge = useStore(s => s.tick - s.flopSetAt);

  const reversedCards = reverse([...flop.cards]);
  const blankCard = new Card();

  return (
    <HStack align="center" spacing={4} borderWidth={1} p={5}>
      <CardRender card={blankCard} />
      <CardStack
        cards={reversedCards}
        highlightCards={highlightCards}
        alertCards={flopAge < 10 ? [first(reversedCards)!] : []}
        cardScale={1.4}
        {...styleProps}
      />
      <CardRender card={retiredCard} opacity={0.4} />
    </HStack>
  );
}

export default FlopDisplay;
