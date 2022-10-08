import winston, { format, transports } from 'winston';

class Logger {
  private static logger: winston.Logger;

  public static getInstance() {
    if (!Logger.logger) {
      Logger.logger = winston.createLogger({
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
          Logger.formatLogMessage()
        ),
        transports: [new transports.Console()],
        exceptionHandlers: [
          new transports.Console(),
          new transports.File({ filename: 'exception.log' }),
        ],
      });
    }
    return Logger.logger;
  }

  private static formatLogMessage() {
    return format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${
        label || process.env.APP_NAME
      }] ${level}: ${message}`;
    });
  }
}

export default Logger.getInstance();
