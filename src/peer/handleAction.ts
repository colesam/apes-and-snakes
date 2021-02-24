import { setPrivate } from "../store/privateStore";
import { getShared, setShared } from "../store/sharedStore";
import handleClosePosition from "./actionHandlers/handleClosePosition";
import handleEndGame from "./actionHandlers/handleEndGame";
import handleJoin from "./actionHandlers/handleJoin";
import handleOpenPosition from "./actionHandlers/handleOpenPosition";
import handlePing from "./actionHandlers/handlePing";
import handleReconnect from "./actionHandlers/handleReconnect";
import handleStartGame from "./actionHandlers/handleStartGame";
import PeerError from "./error/PeerError";
import { TPeerAction } from "./types/TPeerAction";

export interface TActionHandlerProps {
  peerId: string;
  payload: any;
  respond: (payload?: any) => void;
  error: (e: PeerError) => void;
}

type TActionHandler = (props: TActionHandlerProps) => void;

const actionHandlerMap: { [key in TPeerAction]: TActionHandler } = {
  [TPeerAction.PING]: handlePing,

  [TPeerAction.JOIN]: handleJoin,

  [TPeerAction.RECONNECT]: handleReconnect,

  [TPeerAction.START_GAME]: handleStartGame,

  [TPeerAction.END_GAME]: handleEndGame,

  [TPeerAction.OPEN_POSITION]: handleOpenPosition,

  [TPeerAction.CLOSE_POSITION]: handleClosePosition,

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
