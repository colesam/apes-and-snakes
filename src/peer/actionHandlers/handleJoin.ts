import generateId from "../../core/generateId";
import { Player } from "../../core/player/Player";
import { PlayerConnection } from "../../core/player/PlayerConnection";
import { getStore, setStore } from "../../store/store";
import NameTakenError from "../error/NameTakenError";
import { TActionHandlerProps } from "../handleAction";

const handleJoin = ({ payload, respond, error }: TActionHandlerProps) => {
  const { players } = getStore();

  const playerName = payload.playerName.trim();
  const existingPlayer = players.find(({ name }) => name === playerName);

  if (existingPlayer) return error(new NameTakenError(playerName));

  const playerId = generateId();
  const newPlayer = new Player({
    id: playerId,
    name: payload.playerName,
  });

  setStore(s => {
    s.players.push(newPlayer);
    s.secretKeyPlayerIdMap.set(payload.secretKey, playerId);
    s.playerConnectionMap.set(playerId, new PlayerConnection());
  });

  return respond({ playerId });
};

export default handleJoin;
