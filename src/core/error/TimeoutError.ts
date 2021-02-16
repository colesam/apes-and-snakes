import GeneralError from "./GeneralError";

export const TIMEOUT_ERROR = "TimeoutError";

export default class TimeoutError extends GeneralError {
  public name = TIMEOUT_ERROR;

  constructor(timeout: number) {
    super(`Message was sent but no response was received after ${timeout}ms`);
  }
}
