import { CustomError } from "./CustomError";

export class UnauthorizedError extends CustomError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
