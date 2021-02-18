import GeneralError from "../error/GeneralError";
import { setPrivate } from "../store/privateStore";
import { getShared, setShared } from "../store/sharedStore";
import handleEndGame from "./actionHandlers/handleEndGame";
import handleJoin from "./actionHandlers/handleJoin";
import handlePing from "./actionHandlers/handlePing";
import handleReconnect from "./actionHandlers/handleReconnect";
import { TPeerAction } from "./types/TPeerAction";

export interface TActionHandlerProps {
  peerId: string;
  payload: any;
  respond: (payload?: any) => void;
  error: (e: GeneralError) => void;
}

type TActionHandler = (props: TActionHandlerProps) => void;

const actionHandlerMap: { [key in TPeerAction]: TActionHandler } = {
  [TPeerAction.PING]: handlePing,

  [TPeerAction.JOIN]: handleJoin,

  [TPeerAction.RECONNECT]: handleReconnect,

  [TPeerAction.END_GAME]: handleEndGame,

  [TPeerAction.PULL_SHARED]: ({ respond }) => respond(getShared()),

  [TPeerAction.PUSH_SHARED]: ({ payload, respond }) => {
    setShared(payload);
    respond();
  },

  [TPeerAction.PUSH_PRIVATE]: ({ payload, respond }) => {
    setPrivate(payload);
    respond();
  },
};

// Performs actions on the store in response to received peerActions
const handleAction = (
  action: TPeerAction,
  actionProps: TActionHandlerProps
) => {
  if (!actionHandlerMap.hasOwnProperty(action)) {
    console.error(`Unknown peer data action: ${action}`);
  } else {
    actionHandlerMap[action](actionProps);
  }
};

export default handleAction;
