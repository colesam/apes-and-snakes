import { uniq } from "lodash";
// @ts-ignore
import { Hand as PokerSolver } from "pokersolver";
import { cardFromString } from "./card/Card";
import { Hand } from "./card/Hand";
import { SolvedHand } from "./card/SolvedHand";

export const solve = (hands: Hand[]): SolvedHand[] => {
  return hands.map(solveHand);
};

export const solveHand = (hand: Hand): SolvedHand => {
  if (uniq(hand.cards).length < hand.cards.length) {
    console.log(`[DEBUG] Duplicate cards!`);
    console.log("-- hand.cards --");
    console.log(hand.cards.map(c => c.toString()));
    throw new Error("Duplicate cards detected!");
  }
  const { cards, rank, descr, name } = PokerSolver.solve(hand.cardStrings);
  return new SolvedHand({
    cards: cards.map(({ value, suit }: { value: string; suit: string }) =>
      cardFromString(value + suit)
    ),
    rank,
    descr,
    name,
  });
};

export type RoundRank = 1 | 2 | 3 | 4 | 5 | 6;
