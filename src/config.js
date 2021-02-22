export const NAMESPACE = "sfqxWNtbOKrs45NDDZRvOaP4vAApMTc1";

export const PING_INTERVAL = 5000;

export const TICK_SPEED = 15; // 1500

export const STOCK_PRICE_FLOOR = 10;

export const GENERAL_FLUCTUATION_MAX = 0.1 / 100;
export const BUY_PRICE_MODIFIER = 2.5;
export const BUY_MODIFIER_TICK_LIFETIME = 15;
export const SELL_PRICE_MODIFIER = -2.5;
export const SELL_MODIFIER_TICK_LIFETIME = 15;

export const NUM_ROUNDS = 2; // temporary
export const TICKS_PER_WEEK = 100;
export const ROUND_FLUCTUATION_MAX = GENERAL_FLUCTUATION_MAX * 2;
export const ROUND_RANK_MODIFIERS = {
  1: [3, 2, 2],
  2: [3, 2],
  3: [2, 1],
  4: [2],
  5: [1],
  6: [-1],
  7: [-2],
  8: [-2, -1],
  9: [-3, -2],
  10: [-3, -2, -2],
};
export const TICKS_PER_WEEKEND = TICKS_PER_WEEK * (2 / 7);
export const TICKS_PER_MARKET_OPEN = TICKS_PER_WEEK * (2 / 7);

export const TICKS_PER_GRAPH = NUM_ROUNDS * TICKS_PER_WEEK;

export const SIM_ROUNDS = 2;
