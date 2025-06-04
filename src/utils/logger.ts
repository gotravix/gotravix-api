import { createLogger, format, transports } from "winston";

const prodTransports = [  
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
]

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${timestamp}] ${level}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
      }`;
    })
  ),
  transports: process.env.NODE_ENV !== "production" ? [
    new transports.Console(),
  ] : [
    new transports.Console(),
    ...prodTransports,
  ],
  exitOnError: false,
});

export default logger;