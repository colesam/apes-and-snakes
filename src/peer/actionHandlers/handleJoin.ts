import NameTakenError from "../error/NameTakenError";
import generateId from "../../core/generateId";
import { StoreAction } from "../../store/StoreAction";
import { getShared } from "../../store/sharedStore";
import { Player } from "../../store/types/Player";
import { TActionHandlerProps } from "../handleAction";

const handleJoin = ({ payload, respond, error }: TActionHandlerProps) => {
  const { players } = getShared();
  const playerName = payload.playerName.trim();

  const existingPlayer = players.find(({ name }) => name === playerName);
  if (existingPlayer) return error(new NameTakenError(playerName));

  const playerId = generateId();
  const newPlayer = Player({
    id: playerId,
    name: payload.playerName,
  });

  StoreAction.pushPlayer(newPlayer);
  StoreAction.mapSecretKeyToPlayerId(payload.secretKey, playerId);
  StoreAction.setPlayerConnection(playerId);

  return respond({ playerId });
};

export default handleJoin;
