import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, prettyPrint } = format;
const infoDir = './logs/combined';
const errorDir = './logs/errors';

const mydate = new Date();
const today = mydate.getFullYear() + '-' + ('0' + (mydate.getMonth() + 1)).slice(-2) + '-' + mydate.getDate();
const infoName = today + '-' + 'info.log';
const errorName = today + '-' + 'error.log';

export const logger = createLogger({
  level: 'info',
  format: combine(
    format.json(),
    timestamp(),
    prettyPrint(),
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  defaultMeta: { service: 'logger-service' },
  transports: [
    new transports.File({ 
      filename: path.join(errorDir, `${errorName}`), 
      level: 'error', 
      format: format.combine(
      format.colorize({ all: false }),
    ) }),
    new transports.File({ 
      filename: path.join(infoDir, `${infoName}`), 
      level: 'info', 
      format: format.combine(
      format.colorize({ all: false }),
      ) 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

logger.end();