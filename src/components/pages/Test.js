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
import { Hand } from "pokersolver";
import React, { useState } from "react";
import { Deck } from "../../core/card/Deck";
import CardStack from "../render/CardStack";

const solve = Hand.solve;

function solveHands(hands) {
  return hands.map(hand => Hand.solve(hand.map(c => c.toString())));
}

function rankHands(hands, ranked = []) {
  if (hands.length < 1) return ranked;

  const winners = Hand.winners(hands);

  return rankHands(
    hands.filter(hand => !winners.includes(hand)),
    // @ts-ignore
    [...ranked, ...winners]
  );
}

function Test() {
  const [hands, setHands] = useState([]);
  const [solvedHands, setSolvedHands] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [rounds, setRounds] = useState([]);

  const handleDrawCards = () => {
    let [newHands, deck] = new Deck().shuffle().deal(10, 2);
    setHands(newHands.toArray());

    const newSolved = [];
    const newRanks = [];
    const newRounds = [];
    for (let i = 0; i < 3; i++) {
      const [flop] = deck.shuffle().draw(5);
      const handies = newHands.toArray().map(([a, b]) => {
        return [a.toString(), b.toString(), ...flop.map(c => c.toString())];
      });
      const ranked = rankHands(solveHands(handies));
      newSolved.push(solveHands(handies));
      newRounds.push(flop.toArray());
      newRanks.push(
        handies.map(h => {
          const hKey = h.sort().join();
          return (
            ranked.findIndex(r => {
              const key = r.cardPool
                .map(({ value, suit }) => value + suit)
                .sort()
                .join();
              return key === hKey;
            }) + 1
          );
        })
      );
    }
    setSolvedHands(newSolved);
    setRanks(newRanks);
    setRounds(newRounds);
  };

  console.log(solvedHands);
  console.log(rounds);
  console.log(ranks);

  const handElems = hands.map((cards, i) => (
    <Tr key={i}>
      <Td>
        <CardStack cards={cards} />
      </Td>
      <Td>
        <Text color={ranks[0][i] <= 5 ? "green.500" : "red.500"}>
          Rank: {ranks[0][i]}
        </Text>
        <Text color="gray.500" fontSize={"sm"}>
          {solvedHands[0][i].descr}
        </Text>
      </Td>
      <Td>
        <Text color={ranks[1][i] <= 5 ? "green.500" : "red.500"}>
          Rank: {ranks[1][i]}
        </Text>
        <Text color="gray.500" fontSize={"sm"}>
          {solvedHands[1][i].descr}
        </Text>
      </Td>
      <Td>
        <Text color={ranks[2][i] <= 5 ? "green.500" : "red.500"}>
          Rank: {ranks[2][i]}
        </Text>
        <Text color="gray.500" fontSize={"sm"}>
          {solvedHands[2][i].descr}
        </Text>
      </Td>
    </Tr>
  ));

  // Render
  return (
    <Stack spacing={4}>
      {handElems.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Stock</Th>
              <Th>Round 1</Th>
              <Th>Round 2</Th>
              <Th>Round 3</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td>
                <CardStack cards={rounds[0]} spacing={1} />
              </Td>
              <Td>
                <CardStack cards={rounds[1]} spacing={1} />
              </Td>
              <Td>
                <CardStack cards={rounds[2]} spacing={1} />
              </Td>
            </Tr>
            {handElems}
          </Tbody>
        </Table>
      )}

      <Button colorScheme="blue" onClick={handleDrawCards}>
        Draw Cards
      </Button>
    </Stack>
  );
}

export default Test;
