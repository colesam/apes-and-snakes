import { Button, Table, Tr, Thead, Tbody, Td, Th } from "@chakra-ui/react";
import { groupBy } from "lodash";
import React from "react";
import { formatCurrency } from "../../../core/helpers";
import { Player } from "../../../core/player/Player";
import { Stock } from "../../../core/stock/Stock";
import PercentChange from "../PercentChange";

type PropTypes = {
  tick: number;
  player: Player;
  isOwnPlayer: boolean;
  stocks: Map<string, Stock>;
  isWeekend: boolean;
  onSell: (bundleId: string) => void;
};

function PositionsTable({
  tick,
  player,
  isOwnPlayer,
  stocks,
  isWeekend,
  onSell,
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

  const tickers = Object.keys(groupBy(sortedPositions, "stockTicker"));

  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr sx={{ whiteSpace: "no-wrap" }}>
          <Th>Stock</Th>
          <Th>Qty</Th>
          <Th>Acq Value</Th>
          <Th>Value</Th>
          <Th>% Gain</Th>
          <Th>CGT</Th>
          {isOwnPlayer && <Th w={100} />}
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
            <Tr
              bg={
                tickers.indexOf(bundle.stockTicker) % 2 === 1
                  ? "gray.50"
                  : "white"
              }
              key={bundle.id}
              data-bundle-id={bundle.id}
            >
              <Td fontWeight={"bold"}>
                {stocks.get(bundle.stockTicker)!.name}
              </Td>
              <Td>{bundle.quantity / 1000}K</Td>
              <Td>{formatCurrency(initialValue)}</Td>
              <Td>{formatCurrency(currentValue)}</Td>
              <Td>
                <PercentChange start={initialValue} end={currentValue} />
              </Td>
              <Td>{capitalGainsTax.toFixed(0)}%</Td>
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
