import { shuffle } from "lodash";
import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Card } from "./Card";
import { Flop } from "./Flop";
import { Pair } from "./Pair";
import { allRanks } from "./Rank";
import { allSuits } from "./Suit";

const generateDeck = () => {
  const res = [];
  for (const suit of allSuits) {
    for (const rank of allRanks) {
      res.push(new Card({ rank, suit }));
    }
  }
  return res;
};

type TDeck = {
  cards: Card[];
};

export interface Deck extends DeepReadonly<TDeck> {}

export class Deck extends ImmutableRecord<TDeck> {
  constructor(data?: Partial<TDeck>) {
    super(
      {
        cards: generateDeck(),
      },
      data
    );
  }

  get cards() {
    return this.data.cards;
  }

  shuffle() {
    return new Deck({ cards: shuffle(this.cards) });
  }

  deal(numHands: number, cardsPerHand: number): [Card[][], Deck] {
    const hands = [];
    const cards = [...this.cards];

    for (let i = 0; i < numHands; i++) {
      hands.push(cards.splice(0, cardsPerHand));
    }

    return [hands, new Deck({ cards })];
  }

  dealPairs(numHands: Number): [Pair[], Deck] {
    const pairs = [];

    let deck: Deck = this;
    let pair;
    for (let i = 0; i < numHands; i++) {
      [pair, deck] = deck.drawPair();
      pairs.push(pair);
    }

    return [pairs, deck];
  }

  draw(numCards: number): [Card[], Deck] {
    const cards = [...this.cards];
    return [cards.splice(0, numCards), new Deck({ cards })];
  }

  drawPair(): [Pair, Deck] {
    const [[a, b], deck] = this.draw(2);
    return [new Pair({ cards: [a, b] }), deck];
  }

  drawFlop(): [Flop, Deck] {
    const [[a, b, c, d, e], deck] = this.draw(5);
    return [new Flop({ cards: [a, b, c, d, e] }), deck];
  }

  get size() {
    return this.cards.length;
  }
}
