export class ProductError extends Error {
  constructor(message: string, name: string, cause: string) {
    super(message);
    this.name = name;
    this.cause = cause;
  }
}
