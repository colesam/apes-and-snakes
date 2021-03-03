import { setStore } from "../store";

export const mapSecretKeyToPlayerId = (key: string, playerId: string) => {
  setStore(s => ({
    secretKeyPlayerIdMap: {
      ...s.secretKeyPlayerIdMap,
      [key]: playerId,
    },
  }));
};
