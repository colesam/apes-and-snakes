import GeneralError from "./GeneralError";

export const NAME_TAKEN_ERROR = "NameTakenError";

export default class NameTakenError extends GeneralError {
  public name = NAME_TAKEN_ERROR;

  constructor(name: string) {
    super(
      `Could not create player ${name} because a player already exists with that name.`
    );
  }
}
