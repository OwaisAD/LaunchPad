export abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public abstract serializeErrors(): { message: string; field?: string }[];
}
