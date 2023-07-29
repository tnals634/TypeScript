export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  get getCustomError() {
    const result = [this.message, this.status];
    return result;
  }

  set setCustomError(result: any) {
    this.status = result.status;
    this.message = result.message;
  }
}

export class ServiceReturn {
  status: number;
  message: string;
  result: any;
  constructor(message: string, status: number, result: any) {
    this.status = status;
    this.message = message;
    this.result = result;
  }
}
