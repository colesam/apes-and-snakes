import { Box, Flex, Text } from "@chakra-ui/react";
import { ResponsiveLineCanvas as ResponsiveLine } from "@nivo/line";
import { repeat } from "lodash";
import React from "react";
import styled from "styled-components";
import {
  NUM_ROUNDS,
  TICKS_PER_GRAPH,
  ROUND_MODIFIER_TICK_LIFETIME,
  ROUND_RANK_MODIFIERS,
} from "../../config";
import { RoundRank } from "../../core/poker";

interface PropTypes {
  priceHistory: number[];
  rankHistory: (RoundRank | null)[];
  marketClose: boolean;
}

const GraphOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: start;
  align-items: stretch;
`;

const GraphOverlay_round = styled.div<any>`
  box-sizing: content-box;
  width: ${props => props.width};
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  &::after {
    content: " ";
    width: ${(props: any) => `${props.modifierPeriodWidth || 0}%`};
    border-left: ${props => (props.noBorder ? "none" : "1px solid #aaa")};
    background: #ececec;
    height: 100%;
    display: block;
  }
`;

const rounds = () => {
  return repeat("_", NUM_ROUNDS).split("");
};

function StockGraph({ priceHistory, rankHistory, marketClose }: PropTypes) {
  const priceData = priceHistory.map((price, i) => ({ x: i + 1, y: price }));
  const paddedRankHistory = rounds().map((_, i) => rankHistory[i] || null);
  const modifierPeriodWidth = ROUND_MODIFIER_TICK_LIFETIME;

  const min = Math.min(...priceHistory);
  const max = Math.max(...priceHistory);

  return (
    <>
      <Flex>
        {paddedRankHistory.map((roundRank, i) => {
          let color = "gray";
          if (roundRank) {
            const mod = ROUND_RANK_MODIFIERS[roundRank][0];
            color = mod > 0 ? "green" : "red";
          }
          return (
            <Flex justify={"flex-end"} width={`${100 / NUM_ROUNDS}%`} key={i}>
              <Text
                position={"relative"}
                right={`${ROUND_MODIFIER_TICK_LIFETIME}%`}
                transform={`translateX(50%)`}
                color={`${color}.600`}
                bg={`${color}.100`}
                borderWidth={1}
                borderColor={`${color}.600`}
                fontWeight={"bold"}
                textAlign={"center"}
                w={8}
              >
                {roundRank || "-"}
              </Text>
            </Flex>
          );
        })}
      </Flex>
      <Box h={"120px"} bg="#f6f6f6" position={"relative"}>
        <GraphOverlay>
          {rounds().map((_, i) => (
            <GraphOverlay_round
              modifierPeriodWidth={modifierPeriodWidth}
              width={`${100 / NUM_ROUNDS}%`}
              key={i}
            />
          ))}
        </GraphOverlay>
        <ResponsiveLine
          data={[{ id: "price", data: priceData }]}
          colors={"rgb(56, 161,105)"}
          xScale={{
            type: "linear",
            min: 1,
            max: TICKS_PER_GRAPH,
          }}
          yScale={{
            type: "linear",
            min: min - min * 0.01,
            max: max + min * 0.01,
          }}
          curve={"cardinal"}
          enableGridX={false}
          enableGridY={true}
          gridYValues={[min, max]}
          enableArea={marketClose}
          axisLeft={null}
          axisBottom={null}
          lineWidth={2}
          pointSize={4}
          pointColor={{ theme: "background" }}
        />
      </Box>
    </>
  );
}

export default StockGraph;
