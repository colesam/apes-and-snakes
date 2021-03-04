import { shuffle } from "lodash";
import { ImmerClass } from "../ImmerClass";
import { Card } from "./Card";
import { Flop } from "./Flop";
import { Pair } from "./Pair";
import { allRanks } from "./Rank";
import { allSuits } from "./Suit";

const generateDeck = () => {
  const res = [];
  for (const suit of allSuits) {
    for (const rank of allRanks) {
      res.push(new Card(rank, suit));
    }
  }
  return res;
};

export class Deck extends ImmerClass {
  protected readonly __class = "Deck";

  constructor(public cards: Card[] = generateDeck()) {
    super();
  }

  shuffle() {
    this.cards = shuffle(this.cards);
    return this;
  }

  // TODO: prevent duplicate cards
  insert(cards: Card[]) {
    this.cards.push(...cards);
    return this;
  }

  deal(numHands: number, cardsPerHand: number): Card[][] {
    const hands = [];
    for (let i = 0; i < numHands; i++) {
      hands.push(this.cards.splice(0, cardsPerHand));
    }
    return hands;
  }

  dealPairs(numHands: Number): Pair[] {
    const pairs = [];
    for (let i = 0; i < numHands; i++) {
      pairs.push(this.drawPair());
    }
    return pairs;
  }

  draw(numCards: number): Card[] {
    return this.cards.splice(0, numCards);
  }

  drawPair(): Pair {
    const [a, b] = this.draw(2);
    return new Pair({ cards: [a, b] });
  }

  drawFlop(): Flop {
    const [a, b, c, d, e] = this.draw(5);
    return new Flop({ cards: [a, b, c, d, e] });
  }

  get size() {
    return this.cards.length;
  }
}
