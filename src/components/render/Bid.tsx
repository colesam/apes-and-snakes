import {
  Text,
  Flex,
  Progress,
  Box,
  Button,
  Collapse,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { Stock } from "../../core/stock/Stock";
import StockTicker from "../StockTicker";

type PropTypes = {
  bid: PositionBid;
  stock: Stock;
  onTickerClick: (ticker: string) => void;
  onCloseBid: (bidId: string) => void;
};

function Bid({ bid, stock, onTickerClick, onCloseBid }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);

  const bundle = bid.positionBundle;

  const bidTypeString =
    bid.type === PositionBidType.OPEN ? "PURCHASE ORDER" : "SELL ORDER"; // Will change as shorts are introduced

  const isSqueezed =
    bid.type === PositionBidType.OPEN
      ? stock.hasBuySqueeze
      : stock.hasSellSqueeze;

  const progressQuantity =
    bid.type === PositionBidType.OPEN
      ? bundle.quantity
      : bid.startingQuantity - bundle.quantity;

  const targetQuantity =
    bid.type === PositionBidType.OPEN
      ? bid.targetQuantity
      : bid.startingQuantity;

  const progress =
    bid.type === PositionBidType.OPEN
      ? bundle.quantity / bid.targetQuantity
      : (bid.startingQuantity - bundle.quantity) / bid.startingQuantity;

  return (
    <Box
      bg={"white"}
      borderWidth={1}
      borderRadius={"md"}
      minWidth={350}
      w={"100%"}
      p={4}
      px={4}
      spacing={0}
      cursor={"pointer"}
      fontSize={"sm"}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Flex justify={"space-between"} w={"100%"}>
        <Text fontSize={"md"}>
          <StockTicker
            ticker={stock.ticker}
            onClick={(e, ticker) => {
              e.stopPropagation();
              onTickerClick(ticker);
            }}
          />
          {bidTypeString}
        </Text>
        <Box w={"200px"}>
          <Progress
            value={progress * 100}
            size="sm"
            w={"100%"}
            colorScheme={isSqueezed ? "red" : "blackAlpha"}
            hasStripe={isSqueezed}
            mt={1}
            mb={2}
          />
          <Text
            fontSize={"xs"}
            as={"em"}
            textAlign={"right"}
            display={"block"}
            w={"100%"}
          >
            {progressQuantity / 1000}K of {targetQuantity / 1000}K shares{" "}
            {bid.type === PositionBidType.OPEN ? "acquired" : "liquidated"}
          </Text>
        </Box>
      </Flex>

      <Collapse in={isExpanded} animateOpacity>
        <Divider mt={4} />
        <Box p={1} pt={0} mt={4}>
          <Checkbox>
            <Text fontSize={"sm"}>Automatically stop order on squeeze</Text>
          </Checkbox>
        </Box>
        <Button
          colorScheme={"red"}
          size={"sm"}
          isFullWidth
          display={"block"}
          mt={4}
          onClick={() => onCloseBid(bid.id)}
        >
          STOP ORDER
        </Button>
      </Collapse>
    </Box>
  );
}

export default Bid;
