import { HttpStatusCode } from '../common/statusCode';

type StatusType = keyof typeof HttpStatusCode;

interface ExpressError {
  value?: any;
  msg: string;
  param: string;
  location?: string;
  nestedErrors?: any;
}

class HttpError extends Error {
  public readonly statusType;

  public readonly statusCode;

  public fields: { [k: string]: string[] } = {};

  public databaseCode?: string;

  constructor(message: string, statusType: StatusType) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusType = statusType;
    this.statusCode = HttpStatusCode[`${statusType}`];
    Error.captureStackTrace(this);
  }

  setValidatorError(errors: ExpressError[]) {
    this.fields = errors.reduce<{ [k: string]: string[] }>((acc, val) => {
      if (!acc[val.param]) {
        return { ...acc, [val.param]: [val.msg] };
      }
      acc[val.param].push(val.msg);
      return acc;
    }, {});
  }

  setDatabaseCode(code: string) {
    this.databaseCode = code;
  }
}

export { HttpError };
