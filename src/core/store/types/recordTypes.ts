import { Player } from "./Player";
import { PlayerConnection } from "./PlayerConnection";

// This is needed for deserialization (json-immutable library)
const recordTypes = { Player: Player, PlayerConnection: PlayerConnection };

export default recordTypes;
