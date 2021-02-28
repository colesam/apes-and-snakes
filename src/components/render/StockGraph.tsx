import { Box, Flex, Text } from "@chakra-ui/react";
import { ResponsiveLineCanvas as ResponsiveLine } from "@nivo/line";
import { repeat } from "lodash";
import React from "react";
import styled from "styled-components";
import {
  WEEKS_PER_GRAPH,
  TICKS_PER_GRAPH,
  TICKS_PER_WEEKEND,
  RANK_MODIFIERS,
  WEEKEND_START,
  FLOP_PREVIEW_POINT,
  TICKS_PER_WEEK,
} from "../../config";
import { RoundRank } from "../../core/poker";
import { useSharedStore } from "../../store/sharedStore";

interface PropTypes {
  priceHistory: number[];
  rankHistory: (RoundRank | null)[];
  marketClose: boolean;
}

const rounds = () => {
  return repeat("_", WEEKS_PER_GRAPH).split("");
};

function StockGraph({ priceHistory, rankHistory, marketClose }: PropTypes) {
  const tick = useSharedStore(s => s.tick); // TODO
  const lastWeek = Math.floor(tick / TICKS_PER_WEEK) - 1; // TODO
  const priceData = priceHistory
    .slice(lastWeek * TICKS_PER_WEEK)
    .map((price, i) => ({ x: i + 1, y: price }));
  const paddedRankHistory = rounds().map(
    (_, i) => rankHistory[lastWeek + i] || null
  );

  const min = Math.min(...priceHistory);
  const max = Math.max(...priceHistory);

  return (
    <>
      <Flex>
        {paddedRankHistory.map((roundRank, i) => {
          let color = "gray";
          if (roundRank) {
            const mod = RANK_MODIFIERS[roundRank][0];
            color = mod > 0 ? "green" : "red";
          }
          return (
            <Flex
              justify={"flex-end"}
              width={`${100 / WEEKS_PER_GRAPH}%`}
              key={i}
            >
              <Text
                position={"relative"}
                right={`${TICKS_PER_WEEKEND}%`}
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
            <GraphOverlay_week width={`${100 / WEEKS_PER_GRAPH}%`} key={i}>
              <GraphOverlay_marker
                width={0}
                border="1px dashed #aaa"
                left={toPercent(FLOP_PREVIEW_POINT)}
                key={`test_${i}`}
              />
              <GraphOverlay_marker
                width={(100 * 2) / 7}
                left={toPercent(WEEKEND_START)}
              />
            </GraphOverlay_week>
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

const toPercent = (num: number) => (num * 100).toFixed(5) + "%";

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

const GraphOverlay_week = styled.div<any>`
  position: relative;
  box-sizing: content-box;
  width: ${props => props.width};
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
`;

const GraphOverlay_marker = styled.div<any>`
  position: absolute;
  left: ${props => props.left || 0};
  width: ${props => `${props.width || 0}%`};
  border-left: ${props => props.border || "1px solid #aaa"};
  background: #ececec;
  height: 100%;
  display: block;
`;

export default StockGraph;
