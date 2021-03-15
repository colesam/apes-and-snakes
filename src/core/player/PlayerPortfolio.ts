import { ImmerClass } from "../ImmerClass";

interface TParams {
  playerId: string;
  totalValue: number;
  stockValueMap: Map<string, number>;
}

export class PlayerPortfolio extends ImmerClass {
  protected readonly __class = "PlayerPortfolio";

  public playerId;
  public totalValue;
  public stockValueMap;

  constructor(
    {
      playerId = "",
      totalValue = 0,
      stockValueMap = new Map(),
    } = {} as Partial<TParams>
  ) {
    super();
    this.playerId = playerId;
    this.totalValue = totalValue;
    this.stockValueMap = stockValueMap;
  }

  pushStockValue(stockTicker: string, value: number) {
    this.totalValue += value;

    if (!this.stockValueMap.has(stockTicker)) {
      this.stockValueMap.set(stockTicker, value);
    } else {
      this.stockValueMap.set(
        stockTicker,
        this.stockValueMap.get(stockTicker) + value
      );
    }
  }

  getPortfolioPercent(stockTicker: string) {
    if (this.totalValue < 0.01) return 0;
    return (this.stockValueMap.get(stockTicker) || 0) / this.totalValue;
  }
}
