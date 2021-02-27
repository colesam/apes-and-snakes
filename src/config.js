export const NAMESPACE = "sfqxWNtbOKrs45NDDZRvOaP4vAApMTc1";

export const PING_INTERVAL = 5000;

export const TICK_SPEED = 1000;

export const STOCK_PRICE_FLOOR = 10;

export const GENERAL_FLUCTUATION_MAX = 0.1 / 100;
export const BUY_ROLL_MODIFIER = 2;
export const SELL_ROLL_MODIFIER = -1 * BUY_ROLL_MODIFIER;
export const BUY_MODIFIER_TICK_LIFETIME = 10;
export const SELL_MODIFIER_TICK_LIFETIME = BUY_MODIFIER_TICK_LIFETIME;

export const WEEKS_PER_GRAPH = 2;

// export const RANK_MODIFIERS = {
//   1: [3, 2, 2],
//   2: [3, 2],
//   3: [2, 1],
//   4: [2],
//   5: [1],
//   6: [-1],
//   7: [-2],
//   8: [-2, -1],
//   9: [-3, -2],
//   10: [-3, -2, -2],
// };

export const RANK_MODIFIERS = {
  1: [3, 2, 2],
  2: [3, 2],
  3: [2, 1],
  4: [-2, -1],
  5: [-3, -2],
  6: [-3, -2, -2],
};

export const WEEKEND_FLUCTUATION_MAX = GENERAL_FLUCTUATION_MAX * 2;
export const TICKS_PER_WEEK = 100;
export const TICKS_PER_MARKET_OPEN = TICKS_PER_WEEK * (5 / 7);
export const TICKS_PER_WEEKEND = TICKS_PER_WEEK * (2 / 7);

// Percent positions throughout the week
export const FLOP_PREVIEW_POINT = 2.5 / 7;
export const WEEKEND_START = 5 / 7;

export const TICKS_PER_GRAPH = WEEKS_PER_GRAPH * TICKS_PER_WEEK;

export const NUM_WEEKS = 4;

export const SIM_WEEKS = 1;

export const NUM_STOCKS = 6;

export const PURCHASE_QUANTITIES = [1_000, 5_000, 10_000];

export const DRAW_PAIR_CHANCE = 0.05;
