import { Button, Table, Tr, Thead, Tbody, Td, Th } from "@chakra-ui/react";
import React, { useState } from "react";
import { formatCurrency } from "../../../core/helpers";
import { Player } from "../../../core/player/Player";
import PercentChange from "../PercentChange";

type PropTypes = {
  tick: number;
  player: Player;
  isOwnPlayer: boolean;
  stockPriceMap: { [key: string]: number };
  isWeekend: boolean;
  onSell: (bundleId: string) => void;
};

function PositionsTable({
  tick,
  player,
  isOwnPlayer,
  stockPriceMap,
  isWeekend,
  onSell,
}: PropTypes) {
  const [disabledBundleIds, setDisableBundleIds] = useState<string[]>([]);

  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={100}>Stock</Th>
          <Th w={100}>Qty</Th>
          <Th w={"20%"}>Acquired Value</Th>
          <Th w={"20%"}>Current Value</Th>
          <Th>% Change</Th>
          <Th>CGT</Th>
          {isOwnPlayer && <Th w={100} />}
        </Tr>
      </Thead>
      <Tbody>
        {player.positionBundleList
          .filter(
            bundle =>
              bundle.isSecured && bundle.quantity && !bundle.isLiquidated
          )
          .map(bundle => {
            const initialValue = bundle.initialValue;
            const currentValue = bundle.currentValue(
              stockPriceMap[bundle.stockTicker]
            );
            return (
              <Tr key={bundle.id} data-bundle-id={bundle.id}>
                <Td fontWeight={"bold"}>${bundle.stockTicker}</Td>
                <Td>{bundle.quantity / 1000}K</Td>
                <Td>{formatCurrency(initialValue)}</Td>
                <Td>{formatCurrency(currentValue)}</Td>
                <Td>
                  <PercentChange start={initialValue} end={currentValue} />
                </Td>
                <Td>{(bundle.capitalGainsTax(tick) * 100).toFixed(1)}%</Td>
                {isOwnPlayer && (
                  <Td>
                    <Button
                      size={"xs"}
                      colorScheme={"red"}
                      w={"100%"}
                      disabled={
                        isWeekend ||
                        bundle.isLiquidating ||
                        bundle.capitalGainsTax(tick) === 1 ||
                        disabledBundleIds.includes(bundle.id)
                      }
                      onClick={() => {
                        setDisableBundleIds([...disabledBundleIds, bundle.id]);
                        onSell(bundle.id);
                      }}
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
