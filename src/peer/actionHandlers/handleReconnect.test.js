/* eslint-disable */
import { makeHandleReconnect } from "./handleReconnect";
import { ConnectionStatus } from "../../core/player/ConnectionStatus";

const makeParams = (opts = {}) => ({
  peerId: "123",
  payload: { secretKey: "existing-secret" },
  respond: jest.fn(),
  error: jest.fn(),
  ...opts,
});

const makeGetPrivate = (opts = {}) => () => ({
  secretKeyPlayerIdMap: { "existing-secret": "player-id" },
  ...opts,
});

const makeStoreAction = (opts = {}) => ({
  setPlayerConnection: jest.fn(),
  setPlayerState: jest.fn(),
  ...opts,
});

let callHandleReconnect;
beforeEach(() => {
  callHandleReconnect = ({
    params = makeParams(),
    getPrivate = makeGetPrivate(),
    StoreAction = makeStoreAction(),
  }) => {
    // noinspection JSCheckFunctionSignatures
    const handleReconnect = makeHandleReconnect(getPrivate, StoreAction);
    return handleReconnect(params);
  };
});

test("responds if secret key is found", () => {
  const params = makeParams();

  callHandleReconnect({ params });

  expect(params.respond.mock.calls.length).toBe(1);
});

test("updates player's peer id", () => {
  const params = makeParams();
  const StoreAction = makeStoreAction();

  callHandleReconnect({ params, StoreAction });

  const { mock } = StoreAction.setPlayerConnection;
  expect(mock.calls.length).toBe(1);

  const [playerId, { peerId }] = mock.calls[0];
  expect(playerId).toBe("player-id");
  expect(peerId).toBe("123");
});

test("updates player's connection status to CONNECTED", () => {
  const params = makeParams();
  const StoreAction = makeStoreAction();

  callHandleReconnect({ params, StoreAction });

  const { mock } = StoreAction.setPlayerState;
  expect(mock.calls.length).toBe(1);

  const [playerId, { connectionStatus }] = mock.calls[0];
  expect(playerId).toBe("player-id");
  expect(connectionStatus).toBe(ConnectionStatus.CONNECTED);
});

test("errors if secret key is not found", () => {
  const params = makeParams({
    payload: { secretKey: "missing-secret" },
  });

  callHandleReconnect({ params });

  expect(params.error.mock.calls.length).toBe(1);
});
