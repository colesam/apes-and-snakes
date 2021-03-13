import { cardFromString } from "./card/Card";
import { Flop } from "./card/Flop";
import { Pair } from "./card/Pair";
import { mapPairsToRank } from "./poker";

const pairMap = {
  GME: new Pair({ cards: [cardFromString("Js"), cardFromString("Jh")] }),
  TSLA: new Pair({ cards: [cardFromString("Qc"), cardFromString("5h")] }),
  AMZN: new Pair({ cards: [cardFromString("2s"), cardFromString("4h")] }),
  GOOG: new Pair({ cards: [cardFromString("6h"), cardFromString("5c")] }),
};

const flop = new Flop({
  cards: [
    cardFromString("Ts"),
    cardFromString("Jc"),
    cardFromString("Ks"),
    cardFromString("Ad"),
    cardFromString("3c"),
  ],
});

test("mapPairsToRank maps pairs to ranks correctly", () => {
  const res = mapPairsToRank(pairMap, flop);
  expect(res).toEqual({
    TSLA: 1,
    GME: 2,
    GOOG: 3,
    AMZN: 4,
  });
});
