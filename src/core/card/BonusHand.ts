export enum BonusHand {
  STRAIGHT_FLUSH = "Straight Flush",
  FIVE_OF_A_KIND = "Five of a Kind",
  FOUR_OF_A_KIND_PAIR_PLUS = "Four of a Kind with Pair or Better",
  FOUR_OF_A_KIND = "Four of a Kind",
  THREE_OF_A_KIND_TWO_PAIR = "Three of a Kind with Two Pair",
  FULL_HOUSE = "Full House",
  FLUSH = "Flush",
  STRAIGHT = "Straight",
  TWO_THREE_OF_A_KIND = "Two Three Of a Kind",
  THREE_OF_A_KIND = "Three of a Kind",
  THREE_PAIR = "Three Pair",
  TWO_PAIR = "Two Pair",
}

const tierFiveBonus = [3, 3];
const tierFourBonus = [4, ...tierFiveBonus];
const tierThreeBonus = [5, ...tierFourBonus];
const tierTwoBonus = [10, ...tierThreeBonus];
const tierOneBonus = [10, ...tierTwoBonus];

export const getHandBonus = (handName: string): number[] => {
  switch (handName) {
    case BonusHand.STRAIGHT_FLUSH:
      return tierOneBonus;
    case BonusHand.FIVE_OF_A_KIND:
      return tierOneBonus;
    case BonusHand.FOUR_OF_A_KIND_PAIR_PLUS:
      return tierOneBonus;

    case BonusHand.FOUR_OF_A_KIND:
      return tierTwoBonus;
    case BonusHand.THREE_OF_A_KIND_TWO_PAIR:
      return tierTwoBonus;

    case BonusHand.FULL_HOUSE:
      return tierThreeBonus;
    case BonusHand.FLUSH:
      return tierThreeBonus;
    case BonusHand.STRAIGHT:
      return tierThreeBonus;

    case BonusHand.TWO_THREE_OF_A_KIND:
      return tierFourBonus;

    case BonusHand.THREE_OF_A_KIND:
      return tierFiveBonus;
    case BonusHand.THREE_PAIR:
      return tierFiveBonus;
    case BonusHand.TWO_PAIR:
      return tierFiveBonus;

    default:
      return [];
  }
};
