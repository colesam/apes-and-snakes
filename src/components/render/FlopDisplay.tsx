import { HStack } from "@chakra-ui/react";
import React from "react";
import { Card } from "../../core/card/Card";
import { Flop } from "../../core/card/Flop";
import CardRender from "./Card";
import CardStack, { PropTypes as CardStackPropTypes } from "./CardStack";

interface PropTypes extends CardStackPropTypes {
  cards: Card[];
  retiredCard: Card;
}

function FlopDisplay({ cards = [], retiredCard, ...props }: PropTypes) {
  // Display flop in reverse order (easy to read flow from left -> right)
  const a = cards[0] || new Card();
  const b = cards[1] || new Card();
  const c = cards[2] || new Card();
  const d = cards[3] || new Card();
  const e = cards[4] || new Card();

  // @ts-ignore
  const flop = new Flop({ cards: [a, b, c, d, e] });
  const blankCard = new Card();

  return (
    <HStack align="center" spacing={4}>
      <CardRender card={retiredCard} opacity={0.4} />
      <CardStack cards={flop.cards} {...props} />
      <CardRender card={blankCard} />
    </HStack>
  );
}

export default FlopDisplay;
