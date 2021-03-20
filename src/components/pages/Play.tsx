import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { NAMESPACE } from "../../config";
import generateId from "../../core/generateId";
import { PeerConnectionManager } from "../../peer/PeerConnectionManager";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { useStore } from "../../store/store";
import { logDebug } from "../../util/log";
import CommandBar from "../smart/CommandBar";
import FlopDisplay from "../smart/FlopDisplay";
import SideBar from "../smart/SideBar";
import StockGrid from "../smart/StockGrid";

function Play() {
  // Private store
  const ping = useStore(s => s.ping);
  const previousRoomCode = useStore(s => s.previousRoomCode);
  const secretKey = useStore(s => s.secretKey);

  useEffect(() => {
    logDebug(`Play.tsx initial load.`);
  }, []);

  if (!PeerConnectionManager.peerId) {
    logDebug("Attempting to reconnect to host.");
    attemptReconnectToHost(previousRoomCode, secretKey);
  }

  // Render
  return (
    <Flex
      direction="column"
      align="stretch"
      w="100%"
      minHeight="100vh"
      maxHeight={"100vh"}
      color={"black"}
    >
      <CommandBar />
      <Flex justify="space-between" align={"stretch"} flexGrow={1}>
        <Flex direction={"column"} w={"55%"} pt={4}>
          <FlopDisplay mb={10} />
          <Box overflowY={"auto"} height={0} flexGrow={1}>
            <StockGrid />
          </Box>
        </Flex>
        <SideBar />
        <Box
          position={"absolute"}
          right={"20px"}
          bottom={"20px"}
          bg={"white"}
          border={"1px"}
          p={1}
        >
          <strong style={{ marginRight: "5px" }}>Ping:</strong>
          <span>{ping ? `${ping}ms` : "none"}</span>
        </Box>
      </Flex>
    </Flex>
  );
}

const attemptReconnectToHost = async (roomCode: string, secretKey: string) => {
  const hostId = `${NAMESPACE} ${roomCode}`;
  const peerId = `${hostId} ${generateId()}`;
  await PeerConnectionManager.register(peerId);
  await PeerConnectionManager.connect(hostId);
  await PeerRoutine.reconnect(hostId, secretKey);
};

export default Play;
