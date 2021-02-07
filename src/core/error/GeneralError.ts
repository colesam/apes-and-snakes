export default class GeneralError extends Error {
  constructor(message: string, name?: string) {
    super(message);
    if (name) this.name = name;
  }

  toJSON() {
    return { name: this.name, message: this.message };
  }

  toString() {
    return `[${this.name}] ${this.message}`;
  }
}
