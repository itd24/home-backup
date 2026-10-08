import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'

// Absolute path to /logs at project root
const logDir = path.join(process.cwd(), 'logs')

// Ensure directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const transport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '60d',
  zippedArchive: true,
})

const logger = winston.createLogger({
  level: 'info',
  transports: [transport],
})

export default logger

/*
logger.log('silly', "127.0.0.1 - there's no place like home");
logger.log('debug', "127.0.0.1 - there's no place like home");
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");
logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");
*/