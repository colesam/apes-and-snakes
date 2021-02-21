// @ts-ignore
import { Hand as PokerSolver } from "pokersolver";
import { Flop } from "./card/Flop";
import { Hand } from "./card/Hand";
import { Pair } from "./card/Pair";

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
  rankedHands: SolvedHand[][]
): SolvedHand[][] => {
  if (hands.length < 1) return rankedHands;

  const winners = PokerSolver.winners(hands);

  // TODO: Add handling for ties
  return rankHandsRecursive(
    hands.filter(hand => !winners.includes(hand)),
    [...rankedHands, tiebreakerOrdering(winners)]
  );
};

export const rankHands = (hands: SolvedHand[]): [SolvedHand, number][] => {
  const sortedByRank = rankHandsRecursive(hands, []);
  return hands.map(hand => {
    const rankIndex = sortedByRank.findIndex(
      rank => rank.findIndex(rHand => getKey(rHand) === getKey(hand)) > -1
    );
    return [hand, rankIndex + 1];
  });
};

export type RoundRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const mapPairsToRank = (
  pairMap: {
    [key: string]: Pair;
  },
  flop: Flop
): { [key: string]: RoundRank } => {
  const hands = [];
  const handKeyMap: { [key: string]: keyof typeof pairMap } = {};
  for (const key in pairMap) {
    const hand = new Hand({ pair: pairMap[key], flop });
    hands.push(hand);
    handKeyMap[hand.key] = key;
  }

  const rankedHands = rankHands(solve(hands));
  return rankedHands.reduce((acc, [solvedHand, rank]) => {
    const key = handKeyMap[getKey(solvedHand)];
    // @ts-ignore
    acc[key] = rank;
    return acc;
  }, {});
};
