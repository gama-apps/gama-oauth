const File = require('./file');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');
const moment = require('moment');

/** create folders */
File.createFolderIfNotExist(`${process.env.LOG_FOLDER.trim()}`);
File.createFolderIfNotExist(`${process.env.LOG_FOLDER.trim()}/${process.env.NODE_ENV.trim()}`);

// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

const prettyFormat = printf(({ level, message, timestamp }) =>
`${timestamp} - ${level}: ${message}`);

// https://github.com/winstonjs/winston/issues/1135
const wformat = combine(
  colorize(),
  timestamp(),
  prettyFormat
  );
  
  const folder = process.env.NODE_ENV.trim(),
  date = moment().format('YYYY-MM-DD');
  
  let logger = createLogger({
    format: wformat,
    transports: [
      new transports.File({
        filename: path.join(__dirname, '../../', process.env.LOG_FOLDER.trim(), folder, date, 'error.log'),
        level: 'error',
        json: false,
        handleExceptions: true,
        maxsize: 5120000, // 5MB,
        maxFiles: 5,
        // format: prettyFormat
      }),
      
      new transports.File({
        filename: path.join(__dirname, '../../', process.env.LOG_FOLDER.trim(), folder, date, 'access.log'),
        level: 'debug',
        json: false,
        handleExceptions: true,
        maxsize: 5120000, // 5MB,
        maxFiles: 5,
        // format: prettyFormat
      })
    ]
  });
  
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.simple()
    }));
  }
  
  
  module.exports = logger;