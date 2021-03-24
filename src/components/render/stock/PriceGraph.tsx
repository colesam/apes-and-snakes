import { Box } from "@chakra-ui/react";
import { ResponsiveLineCanvas as ResponsiveLine } from "@nivo/line";
import { repeat } from "lodash";
import React from "react";
import styled from "styled-components";
import {
  WEEKS_PER_GRAPH,
  WEEKEND_START,
  TICKS_PER_GRAPH,
} from "../../../config";

interface PropTypes {
  priceHistory: number[];
  viewFullHistory?: boolean;
}

const rounds = () => {
  return repeat("_", WEEKS_PER_GRAPH).split("");
};

function PriceGraph({ priceHistory, viewFullHistory = false }: PropTypes) {
  let priceData = priceHistory.map((price, i) => ({
    x: i + 1,
    y: price,
  }));

  const min = Math.min(...priceHistory);
  const max = Math.max(...priceHistory);

  return (
    <Box h={"120px"} bg="#f6f6f6" position={"relative"}>
      {!viewFullHistory && (
        <GraphOverlay>
          {rounds().map((_, i) => (
            <GraphOverlay_week width={`${100 / WEEKS_PER_GRAPH}%`} key={i}>
              <GraphOverlay_marker
                width={(100 * 2) / 7}
                left={toPercent(WEEKEND_START)}
              />
            </GraphOverlay_week>
          ))}
        </GraphOverlay>
      )}
      <ResponsiveLine
        data={[{ id: "price", data: priceData }]}
        colors={"rgb(56, 161,105)"}
        xScale={{
          type: "linear",
          min: 1,
          max: viewFullHistory ? priceHistory.length : TICKS_PER_GRAPH,
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
        enableArea={viewFullHistory}
        axisLeft={null}
        axisBottom={null}
        lineWidth={2}
        pointSize={4}
        pointColor={{ theme: "background" }}
        isInteractive={false}
      />
    </Box>
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

// https://github.com/immerjs/immer/issues/768 - preventing priceHistory ref from changing
// export default moize(PriceGraph, {
//   isReact: true,
//   profileName: "<PriceGraph />",
// });

export default PriceGraph;
