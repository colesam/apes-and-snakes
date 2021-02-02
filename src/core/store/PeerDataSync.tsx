import PeerConnectionManager from "../peer/PeerConnectionManager";
import Player from "./types/Player";
import { UseStore } from "zustand";
import { StoreType } from "./Store";

const { send, broadcast } = PeerConnectionManager;

// Need way to call these methods from components, hooks?
export const initSync = (store: UseStore<StoreType>) => {
  PeerConnectionManager.onReceiveData((peerId, data) => {
    const { action, payload } = data;
    const { isHost, ...storeData } = store.getState();

    switch (action) {
      case "PING":
        send(peerId, { action: "PONG" });
        break;

      case "PONG":
        break;

      case "JOIN":
        send(peerId, {
          action: "PUSH_DATA",
          payload: storeData,
        });
        store.getState().pushPlayer(new Player(peerId, payload.playerName));
        break;

      case "PUSH_DATA":
        // Update store with new data
        store.setState(payload);
        break;

      default:
        console.error(`Unknown peer data action: ${action}`);
    }
  });
};

export const ping = (peerId: string) => send(peerId, { action: "PING" });

export const join = (peerId: string, playerName: string) =>
  send(peerId, { action: "JOIN", payload: { playerName } });

export const broadcastData = (data: any) =>
  broadcast({ action: "PUSH_DATA", payload: data });
