import { Box, HTMLChakraProps } from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";
import cardAssets from "../../assets/cards";
import { Card as TCard } from "../../core/card/Card";

// Images aren't cropped so they have to be cropped with CSS
const StyledImg = styled.img`
  width: 64px;
  max-width: 64px;
  transform: translate(-11px, -2px);
`;

interface PropTypes extends HTMLChakraProps<"div"> {
  card: TCard;
  scale?: number;
  highlight?: boolean;
}

function Card({ card, scale, highlight = false, ...props }: PropTypes) {
  const transformStyling = `
    ${scale ? `scale(${scale})` : ""}
    ${highlight ? "translateY(-3px)" : ""}
  `;

  return (
    <Box
      width="42px"
      height="60px"
      overflow="hidden"
      transform={transformStyling}
      sx={{
        transition: "all 0.1s ease-in",
        borderRadius: "2px",
        boxShadow: highlight
          ? "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
          : "none",
      }}
      {...props}
    >
      <StyledImg src={cardAssets[card.toString()]} alt={card.toString()} />
    </Box>
  );
}

export default Card;

// TODO: Clean up styling, too complicated/messy
