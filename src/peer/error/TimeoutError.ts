import PeerError from "./PeerError";

export const TIMEOUT_ERROR = "TimeoutError";

export default class TimeoutError extends PeerError {
  public name = TIMEOUT_ERROR;

  constructor(timeout: number) {
    super(`Message was sent but no response was received after ${timeout}ms`);
  }
}
