import PeerError from "../peer/error/PeerError";

export const diff = <T>(newState: T, oldState: T): Partial<T> => {
  const stateChanges: Partial<T> = {};

  for (const [key, value] of Object.entries(newState)) {
    // @ts-ignore
    if (!oldState.hasOwnProperty(key) || oldState[key] !== value) {
      // @ts-ignore
      stateChanges[key] = value;
    }
  }

  return stateChanges;
};

export const errorLog = (e: PeerError) => console.error(e.toString());
