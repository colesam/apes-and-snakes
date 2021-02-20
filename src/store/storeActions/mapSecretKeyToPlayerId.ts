import { getPrivate, setPrivate } from "../privateStore";

export const mapSecretKeyToPlayerId = (key: string, playerId: string) => {
  const { secretKeyPlayerIdMap } = getPrivate();

  setPrivate({
    secretKeyPlayerIdMap: {
      ...secretKeyPlayerIdMap,
      [key]: playerId,
    },
  });
};
