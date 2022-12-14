import winston, { format, transports } from 'winston';
import TelegramLogger from 'winston-telegram';
import expressWinston from 'express-winston';

interface PrintfParams {
  level: string;
  message: string;
  label?: string;
  timestamp?: string;
  meta?: {
    req?: {
      url: string;
      headers: {
        host: string;
        'user-agent': string;
        accept: string;
      };
      method: string;
      httpVersion: string;
      originalUrl: string;
      query: object;
    };
    res?: {
      statusCode: number;
    };
    responseTime?: number;
  };
  [key: string]: any;
}

class Logger {
  private static logger: winston.Logger;

  public static getInstance() {
    if (!Logger.logger) {
      const loggerTransports: any[] = [new transports.Console()];
      if (process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_TOKEN) {
        loggerTransports.push(
          new TelegramLogger({
            chatId: parseInt(process.env.TELEGRAM_CHAT_ID, 10),
            token: process.env.TELEGRAM_TOKEN,
            level: 'error',
            formatMessage: (options, info) => {
              const symbols = Object.getOwnPropertySymbols(info);
              const messageIndex = symbols.findIndex(
                (symbol) => symbol.description === 'message'
              );
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
              return info[symbols[`${messageIndex}`]];
            },
          })
        );
      }
      Logger.logger = winston.createLogger({
        format: format.combine(
          // format.colorize(),
          format.prettyPrint(),
          format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
          Logger.formatLogMessage()
        ),
        transports: loggerTransports,
        exceptionHandlers: [
          new transports.Console(),
          new transports.File({ filename: 'exception.log' }),
        ],
      });
    }
    return Logger.logger;
  }

  public static logHttpRequest() {
    return expressWinston.logger({
      winstonInstance: Logger.getInstance(),
      statusLevels: true,
    });
  }

  private static formatLogMessage() {
    return format.printf(
      ({
        level,
        message,
        label,
        timestamp,
        ...other
      }: PrintfParams): string => {
        const printKeys = [
          'httpVersion',
          'statusCode',
          'responseTime',
          'headers',
        ];
        let details = '';
        // Winston express will populate meta prop
        if (other.meta) {
          Object.entries(other.meta).forEach(([keyP, valueP]) => {
            if (typeof valueP === 'object') {
              Object.entries(valueP).forEach(([key, value]) => {
                if (typeof value === 'object' && printKeys.includes(key)) {
                  details += `${key}:${JSON.stringify(value)}  `;
                } else if (
                  typeof value === 'string' &&
                  printKeys.includes(key)
                ) {
                  details += `${key}:${value}  `;
                }
              });
            } else if (printKeys.includes(keyP)) {
              details += `${keyP}:${valueP}  `;
            }
          });
        }

        return `${timestamp || 'Invalid timestamp'} [${
          label || (process.env.APP_NAME as string)
        }] ${level}: ${message} ${details}`;
      }
    );
  }
}

const loggerInstance = Logger.getInstance();
const loggerHTTP = Logger.logHttpRequest();

export default loggerInstance;

export { loggerHTTP };
