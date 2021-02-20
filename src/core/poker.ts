// @ts-ignore
import { Hand as PokerSolver } from "pokersolver";
import { Hand } from "./card/Hand";

export type SolvedHand = {
  cardPool: { value: string; suit: string }[];
  cards: { value: string; suit: string }[];
  rank: number;
  descr: string;
};

const getKey = (hand: SolvedHand) => {
  return hand.cardPool
    .map(({ value, suit }) => value + suit)
    .sort()
    .join("_");
};

export const solve = (hands: Hand[]): SolvedHand[] => {
  return hands.map(hand => PokerSolver.solve(hand.cardStrings));
};

export const getWinners = (hands: SolvedHand[]) => {
  return PokerSolver.winners(hands);
};

export const tiebreakerOrdering = (hands: SolvedHand[]) => {
  // TODO
  return hands;
};

const rankHandsRecursive = (
  hands: SolvedHand[],
  rankedHands: SolvedHand[]
): SolvedHand[] => {
  if (hands.length < 1) return rankedHands;

  const winners = PokerSolver.winners(hands);

  // TODO: Add handling for ties
  return rankHandsRecursive(
    hands.filter(hand => !winners.includes(hand)),
    [...rankedHands, ...tiebreakerOrdering(winners)]
  );
};

export const rankHands = (hands: SolvedHand[]): [SolvedHand, number][] => {
  const sortedByRank = rankHandsRecursive(hands, []);
  return hands.map(hand => {
    const rankIndex = sortedByRank.findIndex(
      rHand => getKey(rHand) === getKey(hand)
    );
    return [hand, rankIndex + 1];
  });
};
