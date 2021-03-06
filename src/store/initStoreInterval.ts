import { ConnectionStatus } from "../core/player/ConnectionStatus";
import { getStore, setStore } from "./store";

const updatePlayerConnectionStatuses = () => {
  if (getStore().isHost) {
    setStore(s => {
      for (const player of s.players) {
        const conn = s.playerConnectionMap.get(player.id);

        if (!conn || !conn.lastPing) return player;

        const sinceLastPing = new Date().getTime() - conn.lastPing.getTime();

        player.connectionStatus =
          sinceLastPing > 20_000
            ? ConnectionStatus.CONNECTION_LOST
            : sinceLastPing > 10_000
            ? ConnectionStatus.UNRESPONSIVE
            : ConnectionStatus.CONNECTED;
      }
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
