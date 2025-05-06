import { CustomError } from "./CustomError";

export class UserAlreadyExistsError extends CustomError {
  constructor(message = "Authentication required") {
    super(message, 409);
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
