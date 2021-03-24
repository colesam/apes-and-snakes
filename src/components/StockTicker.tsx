import { Button } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  ticker: string;
  onClick?: (ticker: string) => void;
};

function StockTicker({ ticker, onClick = () => {} }: PropTypes) {
  return (
    <Button
      display={"inline-block"}
      fontWeight={"bold"}
      fontSize={"inherit"}
      borderBottomWidth={2}
      borderColor={"gray.600"}
      borderStyle={"dashed"}
      borderRadius={0}
      height={"auto"}
      mr={2}
      p={1}
      cursor={"pointer"}
      variant={"ghost"}
      size={"md"}
      _hover={{
        background: "gray.200",
      }}
      onClick={e => {
        e.stopPropagation(); // parent can manually propagate if desired
        onClick(ticker);
      }}
    >
      ${ticker}
    </Button>
  );
}

export default StockTicker;
