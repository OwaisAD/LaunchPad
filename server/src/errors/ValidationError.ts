import { CustomError } from "./CustomError";

export class ValidationError extends CustomError {
  public readonly statusCode = 400;

  constructor(public errors: { message: string; field?: string }[]) {
    super("Validation Error", 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  public serializeErrors() {
    return this.errors;
  }
}
