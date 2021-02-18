import { getPrivate } from "../privateStore";

export const authPlayerAction = (secretKey: string, playerId: string) => {
  const { secretKeyPlayerIdMap } = getPrivate();
  return (
    secretKeyPlayerIdMap.has(secretKey) &&
    secretKeyPlayerIdMap.get(secretKey) === playerId
  );
};
