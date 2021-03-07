import { Progress } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  volume: number;
};

function Volume({ volume }: PropTypes) {
  return (
    <Progress
      value={getProgressPercent(volume)}
      colorScheme={getColor(volume)}
      hasStripe
    />
  );
}

const getColor = (vol: number) => {
  if (vol > 10_000) {
    return "green";
  }
  if (vol > 5_000) {
    return "blue";
  }
  if (vol >= 1_000) {
    return "yellow";
  }
  return "red";
};

const getProgressPercent = (vol: number) => {
  if (vol > 15_000) {
    return 100;
  }
  if (vol < 1) {
    return 2;
  }
  return (vol / 15_000) * 100;
};

export default Volume;
