import { PeerAction } from "./types/PeerAction";
import { getShared, setShared } from "../store/sharedStore";
import storeActions from "../store/storeActions";
import { setPrivate } from "../store/privateStore";
import GeneralError from "../error/GeneralError";
import handleJoin from "./actionHandlers/handleJoin";
import handlePing from "./actionHandlers/handlePing";
import handleReconnect from "./actionHandlers/handleReconnect";

export interface TActionHandlerProps {
  peerId: string;
  payload: any;
  respond: (payload?: any) => void;
  error: (e: GeneralError) => void;
}

type TActionHandler = (props: TActionHandlerProps) => void;

const actionHandlerMap: { [key in PeerAction]: TActionHandler } = {
  [PeerAction.PING]: handlePing,

  [PeerAction.JOIN]: handleJoin,

  [PeerAction.RECONNECT]: handleReconnect,

  [PeerAction.PULL_SHARED]: ({ respond }) => respond(getShared()),

  [PeerAction.PUSH_SHARED]: ({ payload, respond }) => {
    setShared(payload);
    respond();
  },

  [PeerAction.PUSH_PRIVATE]: ({ payload, respond }) => {
    setPrivate(payload);
    respond();
  },

  [PeerAction.END_GAME]: ({ respond }) => {
    storeActions.resetStores();
    respond();
  },
};

// Performs actions on the store in response to received peerActions
const handleAction = (action: PeerAction, actionProps: TActionHandlerProps) => {
  if (!actionHandlerMap.hasOwnProperty(action)) {
    console.error(`Unknown peer data action: ${action}`);
  } else {
    actionHandlerMap[action](actionProps);
  }
};

export default handleAction;
