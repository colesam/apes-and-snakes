import { getShared } from "../../store/sharedStore";
import NameTakenError from "../../error/NameTakenError";
import generateId from "../../generateId";
import { Player } from "../../store/types/Player";
import storeActions from "../../store/storeActions";
import { TActionHandlerProps } from "../handleAction";
import { ConnectionStatus } from "../../store/types/ConnectionStatus";

const handleJoin = ({ payload, respond, error }: TActionHandlerProps) => {
  const { players } = getShared();
  const playerName = payload.playerName.trim();

  const existingPlayer = players.find(({ name }) => name === playerName);
  if (existingPlayer) return error(new NameTakenError(playerName));

  const playerId = generateId();
  const newPlayer = Player({
    id: playerId,
    name: payload.playerName,
    connectionStatus: ConnectionStatus.CONNECTING,
  });

  storeActions.pushPlayer(newPlayer);
  storeActions.mapSecretKeyPlayerId(payload.secretKey, playerId);
  storeActions.setPlayerConnection(playerId);

  return respond({ playerId });
};

export default handleJoin;
