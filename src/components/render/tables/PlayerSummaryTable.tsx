import { Table, Tr, Thead, Tbody, Td, Th } from "@chakra-ui/react";
import React from "react";
import { formatCurrency } from "../../../core/helpers";

type PropTypes = {
  cash: number;
  assetsValue: number;
};

function PlayerSummaryTable({ cash, assetsValue }: PropTypes) {
  return (
    <Table variant="simple" size={"sm"} bg={"white"}>
      <Thead>
        <Tr>
          <Th w={150}>Cash</Th>
          <Th w={150}>Asset Value</Th>
          <Th isNumeric>Total Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{formatCurrency(cash)}</Td>
          <Td>{formatCurrency(assetsValue)}</Td>
          <Td fontWeight={"bold"} textAlign={"right"}>
            {formatCurrency(cash + assetsValue)}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}

export default PlayerSummaryTable;
