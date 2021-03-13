import { uniq } from "lodash";
// @ts-ignore
import { Hand as PokerSolver } from "pokersolver";
import { Flop } from "./card/Flop";
import { Hand } from "./card/Hand";
import { Pair } from "./card/Pair";
import { Rank } from "./card/Rank";
import { Suit } from "./card/Suit";

export type RawSolvedHand = {
  cardPool: { value: Rank; suit: Suit }[];
  cards: { value: Rank; suit: Suit }[];
  rank: number;
  descr: string;
  name: string;
};

export const solve = (hands: Hand[]): RawSolvedHand[] => {
  return hands.map(solveHand);
};

export const solveHand = (hand: Hand): RawSolvedHand => {
  if (uniq(hand.cards).length < hand.cards.length) {
    console.log(`[DEBUG] Duplicate cards!`);
    console.log("-- hand.cards --");
    console.log(hand.cards.map(c => c.toString()));
    throw new Error("Duplicate cards detected!");
  }

  if (hand.cards.find(card => card.toString() === "Xx")) {
    throw new Error("Blank card found in hand.");
  }

  return PokerSolver.solve(hand.cardStrings);
};

export const getWinners = (hands: RawSolvedHand[]) => {
  return PokerSolver.winners(hands);
};

const rankHandsRecursive = (
  hands: RawSolvedHand[],
  rankedHands: RawSolvedHand[][]
): RawSolvedHand[][] => {
  if (hands.length < 1) return rankedHands;

  const winners = PokerSolver.winners(hands);

  // TODO: Add handling for ties
  return rankHandsRecursive(
    hands.filter(hand => !winners.includes(hand)),
    [...rankedHands, winners]
  );
};

export const rankHands = (
  hands: RawSolvedHand[]
): [RawSolvedHand, number][] => {
  const sortedByRank = rankHandsRecursive(hands, []);
  return hands.map(hand => {
    const rankIndex = sortedByRank.findIndex(
      rank => rank.findIndex(rHand => getKey(rHand) === getKey(hand)) > -1
    );
    return [hand, rankIndex + 1];
  });
};

export type RoundRank = 1 | 2 | 3 | 4 | 5 | 6;

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

const getKey = (hand: any) => {
  return hand.cardPool
    .map(({ value, suit }: any) => value + suit)
    .sort()
    .join("_");
};
