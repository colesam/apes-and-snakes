import React from "react";
import { cardFromString } from "../../core/card/Card";
import CardStack from "../render/CardStack";

function Test() {
  return (
    <CardStack
      cards={[cardFromString("As"), cardFromString("Ad")]}
      highlightColor={"red.500"}
    />
  );
}

export default Test;
