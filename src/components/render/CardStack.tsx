import { HStack, HTMLChakraProps } from "@chakra-ui/react";
import React from "react";
import { Card as TCard } from "../../core/card/Card";
import Card from "./Card";

interface PropTypes extends HTMLChakraProps<"div"> {
  cards: TCard[];
  cardScale?: number;
  spacing?: number;
}

function CardStack({ cards, cardScale, spacing = 4, ...props }: PropTypes) {
  const cardElems = cards.map((card, i) => (
    <Card card={card} scale={cardScale} key={i} />
  ));

  return (
    <HStack spacing={spacing} {...props}>
      {cardElems}
    </HStack>
  );
}

export default CardStack;
