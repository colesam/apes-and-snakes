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

type PropTypes = {
  player: Player;
  onCancelBid: (bidId: string) => void;
};

function BidsTable({ player, onCancelBid }: PropTypes) {
  const [disabledBidIds, setDisabledBidIds] = useState<string[]>([]);

  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={100}>Stock</Th>
          <Th w={150}>Initial Qty</Th>
          <Th w={150}>Target Qty</Th>
          <Th isNumeric>Progress</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {player.positionBids.map(bid => {
          const bundle = player.positionBundles.get(bid.positionBundleId);
          const targetQty = bid.type === PositionBidType.BUY ? bid.quantity : 0;
          if (!bundle) return null;
          const progress =
            bid.type === PositionBidType.BUY
              ? bundle.quantity / bid.quantity
              : (bid.quantity - bundle.quantity) / bid.quantity;
          return (
            <Tr key={bid.id} data-bid-id={bid.id}>
              <Td fontWeight={"bold"}>${bundle.stockTicker}</Td>
              <Td>{bundle.quantity / 1000}K</Td>
              <Td>{targetQty / 1000}K</Td>
              <Td>
                <Flex justify="flex-end">
                  <Progress
                    value={progress * 100}
                    size="xs"
                    w={100}
                    colorScheme="blackAlpha"
                  />
                </Flex>
              </Td>
              <Td>
                <Button
                  size={"xs"}
                  colorScheme={"red"}
                  disabled={disabledBidIds.includes(bid.id)}
                  onClick={() => {
                    setDisabledBidIds([...disabledBidIds, bid.id]);
                    onCancelBid(bid.id);
                  }}
                >
                  CANCEL
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
