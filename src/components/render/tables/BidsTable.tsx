import {
  Table,
  Tr,
  Thead,
  Tbody,
  Td,
  Th,
  Progress,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { formatCurrency } from "../../../core/helpers";
import { Player } from "../../../core/player/Player";

type PropTypes = {
  player: Player;
  stockPriceMap: { [key: string]: number };
};

function BidsTable({ player, stockPriceMap }: PropTypes) {
  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={100}>Stock</Th>
          <Th w={150}>Current Price</Th>
          <Th w={150}>Acquired Qty</Th>
          <Th w={150}>Target Qty</Th>
          <Th isNumeric>Progress</Th>
        </Tr>
      </Thead>
      <Tbody>
        {player.positionBids.map(bid => {
          const bundle = player.positionBundles.get(bid.positionBundleId);
          if (!bundle) return null;
          return (
            <Tr key={bid.id} data-bid-id={bid.id}>
              <Td fontWeight={"bold"}>${bundle.stockTicker}</Td>
              <Td>{formatCurrency(stockPriceMap[bundle.stockTicker])}</Td>
              <Td>{bundle.quantity / 1000}K</Td>
              <Td>{bid.quantity / 1000}K</Td>
              <Td>
                <Flex justify="flex-end">
                  <Progress
                    value={(bundle.quantity / bid.quantity) * 100}
                    size="xs"
                    w={100}
                    colorScheme="blackAlpha"
                  />
                </Flex>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default BidsTable;
