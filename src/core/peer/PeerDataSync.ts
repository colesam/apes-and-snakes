import PeerConnectionManager from "./PeerConnectionManager";
import { Player } from "../store/types/Player";
import { getShared, pushPlayer, setShared } from "../store/Store";

const { send, broadcast } = PeerConnectionManager;

enum SyncAction {
  PING = "PING",
  PONG = "PONG",
  JOIN = "JOIN",
  PUSH_DATA = "PUSH_DATA",
}

export const ping = (peerId: string) =>
  send(peerId, { action: SyncAction.PING });

export const pong = (peerId: string) =>
  send(peerId, { action: SyncAction.PONG });

export const join = (peerId: string, playerName: string) =>
  send(peerId, { action: SyncAction.JOIN, payload: { playerName } });

export const pushData = (peerId: string, data: any) =>
  send(peerId, { action: SyncAction.PUSH_DATA, payload: data });

export const broadcastData = (data: any) =>
  broadcast({ action: SyncAction.PUSH_DATA, payload: data });

export const initSync = () => {
  PeerConnectionManager.onReceiveData((peerId, data) => {
    const { action, payload } = data;

    switch (action) {
      case SyncAction.PING:
        pong(peerId);
        break;

      case SyncAction.PONG:
        setTimeout(() => ping(peerId), 5000);
        break;

      case SyncAction.JOIN:
        pushData(peerId, getShared());
        pushPlayer(
          Player({
            id: peerId,
            name: payload.playerName,
          })
        );
        break;

      case SyncAction.PUSH_DATA:
        // Update store with new data
        console.log(`[DEBUG] SETTING DATA`);
        console.log(payload.players.toArray()[0]?.toObject());
        setShared(payload);
        break;

      default:
        console.error(`Unknown peer data action: ${action}`);
    }
  });
};
