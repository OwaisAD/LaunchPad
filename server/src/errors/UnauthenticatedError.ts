import { CustomError } from "./CustomError";

export class UnauthenticatedError extends CustomError {
  constructor(message = "Authentication required") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
