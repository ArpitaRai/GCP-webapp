 import winston from 'winston'

// const { combine, timestamp, printf, colorize, align } = winston.format;
// const logLevels = {
//   fatal: 0,
//   error: 1,
//   warn: 2,
//   info: 3,
//   debug: 4,
//   trace: 5,
// };

// var logger = winston.createLogger({
//   levels: logLevels,
//   level: process.env.LOG_LEVEL || 'info',
//   format: combine(
//     timestamp({
//       format: 'YYYY-MM-DD hh:mm:ss A',
//     }),
//     align(),
//     printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
//   ),
//   transports: [
//     new winston.transports.Console(),
//     process.env.ENV === 'dev' ? new transports.File({ filename: "./logs/webapp.log" }) : new winston.transports.File({ filename: '../../var/log/webapp/csye6225.log' })  ]
// });




//const winston = require("winston");
import { transports, format } from "winston";
 
const customFormat = format.printf(({ timestamp, level, message }) => {
  return `(${timestamp}) - [${level.toUpperCase()}] - "${message}"`;
});
 
const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
    ),
    transports: [
      // new winston.transports.Console(),
      process.env.ENV === 'dev' ? new transports.File({ filename: "./logs/webapp.log" }) : new transports.File({  filename: '../../var/log/webapp/csye6225.log' }),
    ]
});
export default logger;