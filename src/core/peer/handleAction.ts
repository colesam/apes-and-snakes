import { Player } from "../store/types/Player";
import { PeerAction } from "./peerActions";
import { getShared, setShared } from "../store/sharedStore";
import storeActions from "../store/storeActions";
import generateId from "../generateId";
import { getPrivate, setPrivate } from "../store/privateStore";
import GeneralError from "../error/GeneralError";
import NameTakenError from "../error/NameTakenError";

// TODO: eventually break this up
// Performs actions on the store in response to received peerActions
const handleAction = (
  action: string,
  peerId: string, // TODO: ditch this param
  payload: any,
  respond: (payload?: any) => void,
  error: (e: GeneralError) => void
) => {
  switch (action) {
    case PeerAction.PING:
      return respond();

    case PeerAction.JOIN:
      const { players } = getShared();
      const playerName = payload.playerName.trim();

      const existingPlayer = players.find(({ name }) => name === playerName);
      if (existingPlayer) return error(new NameTakenError(playerName));

      const newPlayer = Player({
        id: generateId(),
        name: payload.playerName,
      });

      storeActions.pushPlayer(newPlayer);
      storeActions.mapSecretKeyPlayerId(payload.secretKey, newPlayer.id);
      storeActions.mapPlayerIdPeerId(newPlayer.id, peerId);

      return respond({ playerId: newPlayer.id });

    case PeerAction.RECONNECT:
      const { secretKeyPlayerIdMap } = getPrivate();

      const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

      if (!playerId) {
        throw new Error("Could not find playerId. Failed to reconnect.");
      }

      storeActions.mapPlayerIdPeerId(playerId, peerId);

      return respond();

    case PeerAction.PULL_SHARED:
      return respond({ sharedState: getShared() });

    case PeerAction.PUSH_SHARED:
      // Update shared store with new data
      setShared(payload);
      return respond();

    case PeerAction.PUSH_PRIVATE:
      // Update private store with new data
      setPrivate(payload);
      return respond();

    case PeerAction.END_GAME:
      storeActions.resetStores();
      return respond();

    default:
      console.error(`Unknown peer data action: ${action}`);
  }
};

export default handleAction;
