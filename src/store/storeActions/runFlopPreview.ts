import { TStore } from "../store";

export const runFlopPreview = (s: TStore) => {
  s.flop = s.deck.drawFlop();
  s.flopDisplay = s.flop.preview;
};
