export const NAMESPACE = "sfqxWNtbOKrs45NDDZRvOaP4vAApMTc1";
export const USE_PEER_DEV_SERVER = true;
export const PEER_DEV_SERVER = {
  host: "localhost",
  port: 9000,
  secure: false,
};

// Game config
export const PING_INTERVAL = 5000;

export const TICK_SPEED = 1500;

export const STOCK_PRICE_FLOOR = 10;

export const GENERAL_FLUCTUATION_MAX = 0.0017;
export const BUY_MODIFIER_TICK_LIFETIME = 20;
export const SELL_MODIFIER_TICK_LIFETIME = BUY_MODIFIER_TICK_LIFETIME;

export const BUY_VOLATILITY_MODIFIER = 0.002 / 10_000;
export const SELL_VOLATILITY_MODIFIER = BUY_VOLATILITY_MODIFIER;

export const WEEKS_PER_GRAPH = 1;

export const RANK_ROLLS = {
  1: [1, 1, 1],
  2: [1, 1],
  3: [1],
  4: [-1],
  5: [-1, -1],
  6: [-1, -1, -1],
};

export const TICKS_PER_WEEK = 100; // tes
export const TICKS_PER_DAY = TICKS_PER_WEEK / 7;

// Percent positions throughout the week
export const WEEK_MIDDLE = 2.5 / 7;
export const WEEKEND_START = 5 / 7;
export const WEEKEND_END = 7 / 7;

export const TICKS_PER_GRAPH = WEEKS_PER_GRAPH * TICKS_PER_WEEK;

export const NUM_WEEKS = 20;

export const SIM_WEEKS = WEEK_MIDDLE;
// export const SIM_WEEKS = NUM_WEEKS;

export const NUM_STOCKS = 6;

export const PURCHASE_QUANTITIES = [5_000, 10_000, 20_000];

export const DRAW_PAIR_CHANCE = 0.15;
export const FLOPS_PER_WEEK = 2;
export const FLOP_SHIFT_CHANCE = FLOPS_PER_WEEK / TICKS_PER_WEEK;
export const EXPECTED_FLOP_LIFETIME = TICKS_PER_WEEK / FLOPS_PER_WEEK;
export const FLOP_SHIFT_COOLDOWN = EXPECTED_FLOP_LIFETIME / 5;

export const PLAYER_CASH_GROWTH_RATE = 0.05; // 5%
