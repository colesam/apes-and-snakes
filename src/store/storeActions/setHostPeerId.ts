import { setPrivate } from "../privateStore";

export const setHostPeerId = (hostPeerId: string) => setPrivate({ hostPeerId });
