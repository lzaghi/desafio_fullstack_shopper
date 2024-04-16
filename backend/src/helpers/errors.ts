export class ErrorStatus extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  }
}

export class BadRequestError extends ErrorStatus {
  constructor(message: string) {
      super(message, 400);
  }
}