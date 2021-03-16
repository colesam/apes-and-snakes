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
  alert?: boolean;
}

function Card({
  card,
  scale,
  highlight = false,
  alert = false,
  ...props
}: PropTypes) {
  const transformStyling = `
    ${scale ? `scale(${scale})` : ""}
    ${highlight || alert ? "translateY(-5px)" : ""}
  `;

  let boxShadow = "none";
  if (highlight) {
    const color = "#63b3ed"; // blue.300
    boxShadow = `0 0 3px 2px ${color}, 0 0 0 2px ${color}`;
  } else if (alert) {
    const color = "#ff4949"; // custom red
    boxShadow = `0 0 3px 2px ${color}, 0 0 0 2px ${color}`;
  }

  return (
    <Box
      width="42px"
      height="60px"
      overflow="hidden"
      transform={transformStyling}
      sx={{
        transition: "all 0.1s ease-in",
        borderRadius: "3px",
        boxShadow,
      }}
      {...props}
    >
      <StyledImg src={cardAssets[card.toString()]} alt={card.toString()} />
    </Box>
  );
}

export default Card;

// TODO: Clean up styling, too complicated/messy
