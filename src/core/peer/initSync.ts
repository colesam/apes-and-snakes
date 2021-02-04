import PeerConnectionManager from "./PeerConnectionManager";
import { Player } from "../store/types/Player";
import peerActions, { PeerAction } from "./peerActions";
import { getShared, setShared } from "../store/sharedStore";
import storeActions from "../store/storeActions";

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
        storeActions.pushPlayer(
          Player({
            id: peerId,
            name: payload.playerName,
          })
        );
        break;

      case PeerAction.PULL_DATA:
        peerActions.pushData(peerId, getShared());
        break;

      case PeerAction.PUSH_DATA:
        // Update shared store with new data
        setShared(payload);
        break;

      default:
        console.error(`Unknown peer data action: ${action}`);
    }
  });
};

export default initSync;
