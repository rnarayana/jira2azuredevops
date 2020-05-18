import winston from "winston";
import jsonStringify from "json-stringify-safe";

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// Format for message
const transformFunction = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} | ${level} | ${jsonStringify(message, null, 2)}`;
  }
);

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.timestamp(),
    transformFunction
  ),
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new winston.transports.File({
      filename: "migration.log",
      handleExceptions: true,
    }),
  ],
});
