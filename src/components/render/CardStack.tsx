import { HStack, HTMLChakraProps } from "@chakra-ui/react";
import React from "react";
import { Card as TCard } from "../../core/card/Card";
import Card from "./Card";

export interface PropTypes extends HTMLChakraProps<"div"> {
  cards: TCard[];
  highlightCards?: TCard[];
  alertCards?: TCard[];
  cardScale?: number;
  spacing?: number;
  highlightColor?: string;
}

function CardStack({
  cards,
  highlightCards = [],
  alertCards = [],
  cardScale,
  highlightColor,
  spacing = 4,
  ...props
}: PropTypes) {
  const highlightCardStrings = highlightCards.map(card => card.toString());
  const alertCardStrings = alertCards.map(card => card.toString());
  const cardElems = cards.map((card, i) => (
    <Card
      card={card}
      highlight={highlightCardStrings.includes(card.toString())}
      // alert={alertCardStrings.includes(card.toString())}
      alert={i === 0}
      scale={cardScale}
      key={i}
    />
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
