import React from "react";
import { Card } from "../../core/card/Card";
import { Flop } from "../../core/card/Flop";
import CardStack, { PropTypes as CardStackPropTypes } from "./CardStack";

interface PropTypes extends CardStackPropTypes {
  cards: Card[];
}

function FlopDisplay({ cards = [], ...props }: PropTypes) {
  const a = cards[0] || new Card();
  const b = cards[1] || new Card();
  const c = cards[2] || new Card();
  const d = cards[3] || new Card();
  const e = cards[4] || new Card();

  // @ts-ignore
  const flop = new Flop({ cards: [a, b, c, d, e] });

  return <CardStack cards={flop.cards} {...props} />;
}

export default FlopDisplay;
