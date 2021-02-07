export default class GeneralError extends Error {
  public code;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }

  toString() {
    return `[${this.code}] ${this.message}`;
  }
}
