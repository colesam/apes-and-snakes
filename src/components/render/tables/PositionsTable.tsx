import {
  Text,
  Button,
  Table,
  Tr,
  Thead,
  Tbody,
  Td,
  Th,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { formatCurrencyNoDecimal } from "../../../core/helpers";
import { Player } from "../../../core/player/Player";
import { Stock } from "../../../core/stock/Stock";
import StockTicker from "../../StockTicker";
import PercentChange from "../PercentChange";

type PropTypes = {
  tick: number;
  player: Player;
  isOwnPlayer: boolean;
  stocks: Map<string, Stock>;
  isWeekend: boolean;
  onSell: (bundleId: string) => void;
  onTickerClick: (stockTicker: string) => void;
};

function PositionsTable({
  tick,
  player,
  isOwnPlayer,
  stocks,
  isWeekend,
  onSell,
  onTickerClick,
}: PropTypes) {
  const liquidatingBundleIds = player.positionBidList.map(
    bid => bid.positionBundle.id
  );

  const sortedPositions = player.positionBundleList
    .filter(bundle => bundle.quantity)
    .sort((a, b) => {
      const primarySort = a.stockTicker.localeCompare(b.stockTicker);
      const secondarySort = a.capitalGainsTax(tick) - b.capitalGainsTax(tick);
      return primarySort || secondarySort;
    });

  if (sortedPositions.length === 0) {
    return <Text>No Active Positions</Text>;
  }

  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr sx={{ whiteSpace: "no-wrap" }}>
          <Th>Stock</Th>
          <Th textAlign={"right"}>Qty</Th>
          <Th textAlign={"right"}>Value</Th>
          <Th textAlign={"right"}>Change</Th>
          <Th textAlign={"right"}>C.G. Tax</Th>
          {isOwnPlayer && <Th />}
        </Tr>
      </Thead>
      <Tbody>
        {sortedPositions.map(bundle => {
          const initialValue = bundle.initialValue;
          const currentValue = bundle.currentValue(
            stocks.get(bundle.stockTicker)!.price
          );
          const capitalGainsTax = bundle.capitalGainsTax(tick) * 100;
          return (
            <Tr key={bundle.id} data-bundle-id={bundle.id}>
              <Td fontWeight={"bold"}>
                <StockTicker
                  ticker={bundle.stockTicker}
                  onClick={(e, ticker) => onTickerClick(ticker)}
                />
              </Td>
              <Td textAlign={"right"}>{bundle.quantity / 1000}K</Td>
              <Td textAlign={"right"}>
                {formatCurrencyNoDecimal(currentValue)}
              </Td>
              <Td>
                <Flex justify={"flex-end"}>
                  <PercentChange start={initialValue} end={currentValue} />
                </Flex>
              </Td>
              <Td textAlign={"right"}>{capitalGainsTax.toFixed(0)}%</Td>
              {isOwnPlayer && (
                <Td>
                  <Button
                    size={"xs"}
                    isFullWidth
                    disabled={
                      isWeekend ||
                      liquidatingBundleIds.includes(bundle.id) ||
                      bundle.capitalGainsTax(tick) === 1
                    }
                    onClick={() => onSell(bundle.id)}
                  >
                    SELL
                  </Button>
                </Td>
              )}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default PositionsTable;
