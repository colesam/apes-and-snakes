import PeerError from "./PeerError";

export const NOT_AUTHORIZED_ERROR = "NotAuthorizedError";

export default class NotAuthorizedError extends PeerError {
  public name = NOT_AUTHORIZED_ERROR;

  constructor() {
    super(
      `Could not authorize request for any active player using your secretKey.`
    );
  }
}
