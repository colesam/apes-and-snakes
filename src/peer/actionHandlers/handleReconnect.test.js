// TODO redo these tests once the refactor is completed
/* eslint-disable */
import { makeHandleReconnect } from "./handleReconnect";
import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { Player } from "../../core/player/Player";

const makeParams = (opts = {}) => ({
  peerId: "123",
  payload: { secretKey: "existing-secret" },
  respond: jest.fn(),
  error: jest.fn(),
  ...opts,
});

const makeGetStore = (opts = {}) => () => ({
  secretKeyPlayerIdMap: new Map([["existing-secret", "player-id"]]),
  players: [new Player({ id: "player-id" })],
  ...opts,
});

let callHandleReconnect;
beforeEach(() => {
  callHandleReconnect = ({
    params = makeParams(),
    getStore = makeGetStore(),
    setStore = jest.fn(),
  }) => {
    // noinspection JSCheckFunctionSignatures
    const handleReconnect = makeHandleReconnect(getStore, setStore);
    return handleReconnect(params);
  };
});

test("responds if secret key is found", () => {
  const params = makeParams();

  callHandleReconnect({ params });

  expect(params.respond.mock.calls.length).toBe(1);
});

test("rejects with NotAuthorizedError if player matching secret key cannot be found", () => {
  const params = makeParams({ payload: { secretKey: "missing-secret" } });

  callHandleReconnect({ params });

  const errorMock = params.error.mock;
  expect(errorMock.calls.length).toBe(1);
  expect(errorMock.calls[0][0].constructor.name).toBe("NotAuthorizedError");
});
