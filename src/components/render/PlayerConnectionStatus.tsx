import React from "react";
import { ConnectionStatus } from "../../core/store/types/ConnectionStatus";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { LayoutProps, Spinner } from "@chakra-ui/react";

interface PropTypes extends LayoutProps {
  connectionStatus: ConnectionStatus;
}

function PlayerConnectionStatus({ connectionStatus, ...props }: PropTypes) {
  switch (connectionStatus) {
    case ConnectionStatus.CONNECTED:
      return <CheckIcon color="green.500" {...props} />;
    case ConnectionStatus.CONNECTING:
      return <Spinner color="blue.500" thickness="3px" {...props} />;
    case ConnectionStatus.UNRESPONSIVE:
      return <WarningTwoIcon color="yellow.500" {...props} />;
    case ConnectionStatus.CONNECTION_LOST:
      return <WarningTwoIcon color="crimson" {...props} />;
    default:
      return null;
  }
}

export default PlayerConnectionStatus;
