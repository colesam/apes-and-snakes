import generateId from "../../core/generateId";
import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { Player } from "../../core/player/Player";
import { StoreAction } from "../../store/StoreAction";
import { getShared } from "../../store/sharedStore";
import NameTakenError from "../error/NameTakenError";
import { TActionHandlerProps } from "../handleAction";

const handleJoin = ({ payload, respond, error }: TActionHandlerProps) => {
  const { players } = getShared();
  const playerName = payload.playerName.trim();

  const existingPlayer = players.find(({ name }) => name === playerName);
  if (existingPlayer) return error(new NameTakenError(playerName));

  const playerId = generateId();
  const newPlayer = new Player({
    id: playerId,
    name: payload.playerName,
    connectionStatus: ConnectionStatus.CONNECTED,
  });

  StoreAction.pushPlayer(newPlayer);
  StoreAction.mapSecretKeyToPlayerId(payload.secretKey, playerId);
  StoreAction.setPlayerConnection(playerId);

  return respond({ playerId });
};

export default handleJoin;
