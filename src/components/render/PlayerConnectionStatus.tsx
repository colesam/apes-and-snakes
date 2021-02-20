import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { LayoutProps, SpaceProps } from "@chakra-ui/react";
import React from "react";
import { ConnectionStatus } from "../../core/player/ConnectionStatus";

interface PropTypes extends LayoutProps, SpaceProps {
  connectionStatus: ConnectionStatus;
}

function PlayerConnectionStatus({
  connectionStatus,
  boxSize = 4,
  ...props
}: PropTypes) {
  switch (connectionStatus) {
    case ConnectionStatus.CONNECTED:
      return (
        <span title="Player is connected.">
          <CheckCircleIcon color="green.500" boxSize={boxSize} {...props} />
        </span>
      );
    case ConnectionStatus.UNRESPONSIVE:
      return (
        <span title="Player is unresponsive.">
          <WarningTwoIcon color="yellow.500" boxSize={boxSize} {...props} />
        </span>
      );
    case ConnectionStatus.CONNECTION_LOST:
      return (
        <span title="Player has lost connection.">
          <WarningTwoIcon color="crimson" boxSize={boxSize} {...props} />
        </span>
      );
    default:
      return null;
  }
}

export default PlayerConnectionStatus;
