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

      function getNewTimestamp() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // const hours = date.getHours();
        // const minutes = date.getMinutes();
        // const seconds = date.getSeconds();
        return `${year}-${month}-${day}`;
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
          new transports.File({
            filename: `logs/${folderPath}/${getNewTimestamp()}.log`,
            maxsize: 10 * 1024 * 1024, // 10 MB
            maxFiles: 1,
            tailable: true,
            level: 'info',
          })
          // new DailyRotateFile({
          //   filename: `logs/${folderPath}/%DATE%.log`,
          //   datePattern: 'YYYY-MM-DD',
          //   zippedArchive: false,
          //   maxSize: '10m',
          //   maxFiles: '1'
          // })
        ]
      });

    // Add error handling for the DailyRotateFile transport
    logger.on('error', (err: NodeJS.ErrnoException) => {
        console.error(`Error logging to file: ${err}`);
    });
    return logger;
}
