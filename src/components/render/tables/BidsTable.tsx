import {
  Table,
  Tr,
  Thead,
  Tbody,
  Td,
  Th,
  Progress,
  Flex,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Player } from "../../../core/player/Player";
import { PositionBidType } from "../../../core/stock/PositionBid";
import { Stock } from "../../../core/stock/Stock";

type PropTypes = {
  player: Player;
  stocks: Stock[];
  onCancelBid: (bidId: string) => void;
};

function BidsTable({ player, stocks, onCancelBid }: PropTypes) {
  const [disabledBidIds, setDisabledBidIds] = useState<string[]>([]);

  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={100}>Stock</Th>
          <Th w={150}>Initial Qty</Th>
          <Th>Target Qty</Th>
          <Th w={150}>Progress</Th>
          <Th w={100} isNumeric />
        </Tr>
      </Thead>
      <Tbody>
        {player.positionBids.map(bid => {
          const stock = stocks.find(stock => stock.ticker === bid.stockTicker);
          const bundle = player.positionBundles.get(bid.positionBundleId);
          const targetQty = bid.type === PositionBidType.BUY ? bid.quantity : 0;
          if (!bundle || !stock) return null;
          const isSqueezed =
            bid.type === PositionBidType.BUY
              ? stock.hasBuySqueeze
              : stock.hasSellSqueeze;
          const progress =
            bid.type === PositionBidType.BUY
              ? bundle.quantity / bid.quantity
              : (bid.quantity - bundle.quantity) / bid.quantity;

          return (
            <Tr
              bg={isSqueezed ? "red.50" : undefined}
              key={bid.id}
              data-bid-id={bid.id}
            >
              <Td fontWeight={"bold"}>${bundle.stockTicker}</Td>
              <Td>{bundle.quantity / 1000}K</Td>
              <Td>{targetQty / 1000}K</Td>
              <Td>
                <Flex justify="flex-end" align={"center"}>
                  <Progress
                    value={progress * 100}
                    size="xs"
                    w={100}
                    colorScheme={isSqueezed ? "red" : "blackAlpha"}
                    mr={4}
                  />
                </Flex>
              </Td>
              <Td>
                <Button
                  size={"xs"}
                  colorScheme={"red"}
                  isFullWidth
                  disabled={disabledBidIds.includes(bid.id)}
                  onClick={() => {
                    setDisabledBidIds([...disabledBidIds, bid.id]);
                    onCancelBid(bid.id);
                  }}
                >
                  STOP
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default BidsTable;
