import { Player } from "../store/types/Player";
import peerActions, { PeerAction } from "./peerActions";
import { getShared, setShared } from "../store/sharedStore";
import storeActions from "../store/storeActions";
import generateId from "../generateId";
import { getPrivate, setPrivate } from "../store/privateStore";

// TODO: eventually break this up
// Performs actions on the store in response to received peerActions
const handleAction = (
  action: string,
  peerId: string, // TODO: ditch this param
  payload: any,
  respond: (payload?: any) => void,
  error: (message: string, code: string) => void
) => {
  switch (action) {
    case PeerAction.PING:
      respond();
      break;

    case PeerAction.JOIN:
      const newPlayer = Player({
        id: generateId(),
        name: payload.playerName,
      });

      storeActions.pushPlayer(newPlayer);
      storeActions.mapSecretKeyPlayerId(payload.secretKey, newPlayer.id);
      storeActions.mapPlayerIdPeerId(newPlayer.id, peerId);

      respond({ playerId: newPlayer.id });
      break;

    case PeerAction.RECONNECT:
      const { secretKeyPlayerIdMap } = getPrivate();

      const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

      if (!playerId) {
        throw new Error("Could not find playerId. Failed to reconnect.");
      }

      storeActions.mapPlayerIdPeerId(playerId, peerId);

      respond();
      break;

    case PeerAction.PULL_SHARED:
      respond({ sharedState: getShared() });
      break;

    case PeerAction.PUSH_SHARED:
      // Update shared store with new data
      setShared(payload);
      respond();
      break;

    case PeerAction.PUSH_PRIVATE:
      // Update private store with new data
      setPrivate(payload);
      respond();
      break;

    case PeerAction.END_GAME:
      storeActions.resetStores();
      respond();
      break;

    default:
      console.error(`Unknown peer data action: ${action}`);
  }
};

export default handleAction;
