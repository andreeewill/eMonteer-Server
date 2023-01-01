import { HttpStatusCode } from '../common/statusCode';

type StatusType = keyof typeof HttpStatusCode;

class HttpError extends Error {
  public readonly statusType;

  public readonly statusCode;

  constructor(message: string, statusType: StatusType) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusType = statusType;
    this.statusCode = HttpStatusCode[`${statusType}`];
    Error.captureStackTrace(this);
  }
}

const a = new HttpError('skldjfdasd', 'BAD_REQUEST');

console.log(a.statusCode, a.message);
