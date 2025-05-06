import { CustomError } from "./CustomError";

export class InvalidCredentialsError extends CustomError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
