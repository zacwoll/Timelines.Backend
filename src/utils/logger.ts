// New plan, use winston, create logger, import logger into everything, create new logger for the service we'll use it for, or we'll import one

import winston from 'winston';
const { createLogger, transports, format } = winston;
const { combine, timestamp, json, prettyPrint, align, padLevels, colorize } = format;
const DailyRotateFile = require('winston-daily-rotate-file');


// // Usage:
// logger.info('This is a log message');

export function createNewLogger(folderPath: string): winston.Logger {

    // level designates a filepath to store the files in. 
    if (!/^[\w\-]+$/g.test(folderPath)) {
        throw new Error(`Invalid level specified: ${folderPath}`);
      }

    const logger = createLogger({
        format: combine(
          timestamp(),
          json(),
          prettyPrint(),
          align(),
          padLevels(),
          colorize()
        ),
        transports: [
          new DailyRotateFile({
            filename: `logs/${folderPath}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '10m',
            maxFiles: '14d'
          })
        ]
      });

    // Add error handling for the DailyRotateFile transport
    logger.on('error', (err: NodeJS.ErrnoException) => {
        console.error(`Error logging to file: ${err}`);
    });
    return logger;
}
