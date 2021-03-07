import { Button, Table, Tr, Thead, Tbody, Td, Th } from "@chakra-ui/react";
import React from "react";
import { formatCurrency } from "../../../core/helpers";
import { Player } from "../../../core/player/Player";
import PercentChange from "../PercentChange";

type PropTypes = {
  player: Player;
  isOwnPlayer: boolean;
  stockPriceMap: { [key: string]: number };
  isWeekend: boolean;
  onSell: (bundleId: string) => void;
};

function PositionsTable({
  player,
  isOwnPlayer,
  stockPriceMap,
  isWeekend,
  onSell,
}: PropTypes) {
  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={100}>Stock</Th>
          <Th w={100}>Qty</Th>
          <Th w={"20%"}>Acquired Value</Th>
          <Th w={"20%"}>Current Value</Th>
          <Th>% Change</Th>
          {isOwnPlayer && <Th w={100}></Th>}
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
                {isOwnPlayer && (
                  <Td>
                    <Button
                      size={"xs"}
                      colorScheme={"red"}
                      w={"100%"}
                      disabled={isWeekend}
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
