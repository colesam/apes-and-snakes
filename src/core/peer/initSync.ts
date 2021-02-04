import PeerConnectionManager from "./PeerConnectionManager";
import { Player } from "../store/types/Player";
import peerActions, { PeerAction } from "./peerActions";
import { getShared, setShared } from "../store/sharedStore";
import storeActions from "../store/storeActions";
import { nanoid } from "nanoid";
import { getPrivate, setPrivate } from "../store/privateStore";

// TODO: eventually break this up
// Performs actions on the store in response to received peerActions
const initSync = () => {
  PeerConnectionManager.onReceiveData((peerId, data) => {
    const { action, payload } = data;

    switch (action) {
      case PeerAction.PING:
        peerActions.pong(peerId);
        break;

      case PeerAction.PONG:
        setTimeout(() => peerActions.ping(peerId), 5000);
        break;

      case PeerAction.JOIN:
        const newPlayer = Player({
          id: nanoid(),
          name: payload.playerName,
        });

        storeActions.pushPlayer(newPlayer);
        storeActions.pushPlayerKey(payload.personalKey, newPlayer.id);

        peerActions.pushPrivate(peerId, { playerId: newPlayer.id });

        break;

      case PeerAction.PULL_SHARED:
        peerActions.pushShared(peerId, getShared());
        break;

      case PeerAction.PUSH_SHARED:
        // Update shared store with new data
        setShared(payload);
        break;

      case PeerAction.PUSH_PRIVATE:
        // Update private store with new data
        setPrivate(payload);
        break;

      default:
        console.error(`Unknown peer data action: ${action}`);
    }
  });
};

export default initSync;
