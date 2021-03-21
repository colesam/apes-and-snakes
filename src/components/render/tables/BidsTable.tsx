import { VStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Player } from "../../../core/player/Player";
import { Stock } from "../../../core/stock/Stock";
import Bid from "../Bid";

type PropTypes = {
  player: Player;
  stocks: Map<string, Stock>;
  onTickerClick: (ticker: string) => void;
  onCloseBid: (bidId: string) => void;
};

function BidsTable({ player, stocks, onTickerClick, onCloseBid }: PropTypes) {
  const [disabledBidIds, setDisabledBidIds] = useState<string[]>([]);

  if (player.positionBidList.length === 0) {
    return <Text>No Active Orders</Text>;
  }

  return (
    <VStack spacing={4} w={"100%"}>
      {player.positionBidList.map(bid => {
        const stock = stocks.get(bid.stockTicker);
        const bundle = bid.positionBundle;

        if (!bundle || !stock) return null;

        return (
          <Bid
            bid={bid}
            stock={stock}
            onTickerClick={onTickerClick}
            onCloseBid={onCloseBid}
            key={bid.id}
          />
        );
      })}
    </VStack>
  );
}

export default BidsTable;
