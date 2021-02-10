import GeneralError from "./GeneralError";

export const NOT_AUTHORIZED_ERROR = "NotAuthorizedError";

export default class NotAuthorizedError extends GeneralError {
  public name = NOT_AUTHORIZED_ERROR;

  constructor(playerId: string) {
    super(
      `Could not authorize request for player ${playerId} using secretKey.`
    );
  }
}