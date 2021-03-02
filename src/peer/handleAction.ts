import { getStore, Selector, setStore } from "../store/store";
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

  [TPeerAction.PULL_DATA]: ({ respond }) =>
    respond(Selector.syncedState(getStore())),

  [TPeerAction.PUSH_DATA]: ({ payload, respond }) => {
    setStore(payload);
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
