import { Box, LayoutProps, SpaceProps } from "@chakra-ui/react";
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

interface PropTypes extends LayoutProps, SpaceProps {
  card: TCard;
  scale?: number;
}

function Card({ card, scale, ...props }: PropTypes) {
  return (
    <Box
      width="42px"
      height="60px"
      overflow="hidden"
      transform={scale ? `scale(${scale})` : undefined}
      boxShadow="md"
      {...props}
    >
      <StyledImg src={cardAssets[card.toString()]} alt={card.toString()} />
    </Box>
  );
}

export default Card;
