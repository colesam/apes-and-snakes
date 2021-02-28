import { HStack, HTMLChakraProps } from "@chakra-ui/react";
import React from "react";
import { Card as TCard } from "../../core/card/Card";
import Card from "./Card";

export interface PropTypes extends HTMLChakraProps<"div"> {
  cards: TCard[];
  cardScale?: number;
  spacing?: number;
  highlightColor?: string;
}

function CardStack({
  cards,
  cardScale,
  highlightColor,
  spacing = 4,
  ...props
}: PropTypes) {
  const cardElems = cards.map((card, i) => (
    <Card card={card} scale={cardScale} key={i} />
  ));

  return (
    <HStack
      display={"inline-flex"}
      p={2}
      spacing={spacing}
      border={highlightColor && "2px"}
      borderColor={highlightColor}
      {...props}
    >
      {cardElems}
    </HStack>
  );
}

export default CardStack;
