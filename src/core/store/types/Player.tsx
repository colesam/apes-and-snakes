import { Record, RecordOf } from "immutable";

export type TPlayer = {
  id: string;
  name: string;
};

export type RPlayer = RecordOf<TPlayer>;

export const Player = Record<TPlayer>(
  {
    id: "",
    name: "",
  },
  "Player"
);
