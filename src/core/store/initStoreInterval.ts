import { getPrivate } from "./privateStore";
import { ConnectionStatus } from "./types/ConnectionStatus";
import { getShared, setShared } from "./sharedStore";

const updatePlayerConnectionStatuses = () => {
  const { isHost, playerConnections } = getPrivate();
  const { players } = getShared();
  if (isHost) {
    setShared({
      players: players.map(player => {
        const conn = playerConnections.get(player.id);

        if (!conn || !conn.lastPing) return player;

        const sinceLastPing = new Date().getTime() - conn.lastPing.getTime();

        return player.merge({
          connectionStatus:
            sinceLastPing > 20_000
              ? ConnectionStatus.CONNECTION_LOST
              : sinceLastPing > 10_000
              ? ConnectionStatus.UNRESPONSIVE
              : ConnectionStatus.CONNECTED,
        });
      }),
    });
  }
};

// Run certain actions on the zustand stores within a set interval
let intervalId: NodeJS.Timeout | null = null;
const initStoreInterval = (duration: number) => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      updatePlayerConnectionStatuses();
    }, duration);
  }
};

export default initStoreInterval;
