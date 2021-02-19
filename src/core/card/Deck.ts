import { List } from "immutable";
import { shuffle } from "lodash";
import { Card } from "./Card";
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

export class Deck {
  cards: Card[] = [];

  constructor(cards?: Card[]) {
    this.cards = cards || generateDeck();
  }

  shuffle() {
    return new Deck(shuffle(this.cards));
  }

  draw(numHands: number, cardsPerHand: number): [List<Card[]>, Deck] {
    let hands = List<Card[]>();
    let cards = [...this.cards];
    for (let i = 0; i < numHands; i++) {
      hands = hands.push(cards.splice(0, cardsPerHand));
    }
    return [hands, new Deck(cards)];
  }

  deal(numCards: number): [List<Card>, Deck] {
    const cards = [...this.cards];
    return [List(cards.splice(0, numCards)), new Deck(cards)];
  }

  get size() {
    return this.cards.length;
  }
}
