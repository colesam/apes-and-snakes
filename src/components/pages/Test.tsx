import { HStack } from "@chakra-ui/layout";
import {
  Button,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Deck } from "../../core/card/Deck";
import { Flop } from "../../core/card/Flop";
import { Hand } from "../../core/card/Hand";
import { Pair } from "../../core/card/Pair";
import { solve, rankHands, SolvedHand } from "../../core/poker";
import CardStack from "../render/CardStack";

function Test() {
  const [deck, setDeck] = useState<Deck>(new Deck());
  const [pairs, setPairs] = useState<Pair[]>([]);
  type Round = {
    flop: Flop;
    hands: Hand[];
    rankedHands: [SolvedHand, number][];
  };
  const [rounds, setRounds] = useState<Round[]>([]);

  const handleDrawCards = () => {
    let [newPairs, newDeck] = new Deck().shuffle().dealPairs(10);
    setDeck(newDeck);
    setPairs(newPairs);
    setRounds([]);
  };

  const handleNextRound = () => {
    const [flop] = deck.shuffle().drawFlop();
    const hands = pairs.map(pair => new Hand({ pair, flop }));
    const rankedHands = rankHands(solve(hands));
    setRounds([...rounds, { flop, hands, rankedHands }]);
  };

  const handElems = pairs.map((pair, i) => {
    const roundElems = rounds.map(round => {
      const [solvedHand, rank] = round.rankedHands[i];
      return (
        <Td>
          <Text color={rank <= 5 ? "green.500" : "red.500"}>Rank: {rank}</Text>
          <Text color="gray.500" fontSize={"sm"}>
            {solvedHand.descr}
          </Text>
        </Td>
      );
    });

    return (
      <Tr key={i}>
        <Td>
          <CardStack cards={pair.cards} />
        </Td>
        {roundElems}
      </Tr>
    );
  });

  // Render
  return (
    <Stack spacing={4}>
      {handElems.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Stock</Th>
              {rounds.map((_, i) => (
                <Th key={i}>Round {i + 1}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              {rounds.map(round => (
                <Td>
                  <CardStack cards={round.flop.cards} spacing={1} />
                </Td>
              ))}
            </Tr>
            {handElems}
          </Tbody>
        </Table>
      )}

      <HStack spacing={4}>
        <Button colorScheme="blue" w={"100%"} onClick={handleDrawCards}>
          Draw Cards
        </Button>
        <Button colorScheme="orange" w={"100%"} onClick={handleNextRound}>
          Next Round
        </Button>
      </HStack>
    </Stack>
  );
}

export default Test;
