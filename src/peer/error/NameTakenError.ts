import PeerError from "./PeerError";

export const NAME_TAKEN_ERROR = "NameTakenError";

export default class NameTakenError extends PeerError {
  public name = NAME_TAKEN_ERROR;

  constructor(name: string) {
    super(
      `Could not create player ${name} because a player already exists with that name.`
    );
  }
}
