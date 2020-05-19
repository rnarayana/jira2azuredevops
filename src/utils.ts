import winston from "winston";
import jsonStringify from "json-stringify-safe";

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

class LoggerCustomFormat {
  // Levels of error
  static customLevels: winston.config.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  static customColors: winston.config.AbstractConfigSetColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "white",
  };

  // // Format for timestamp
  // static appendTimestamp = winston.format((info) => {
  //   info.timestamp = moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS");
  //   return info;
  // });

  // Format for message
  static transformFunction = winston.format.printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${jsonStringify(
      info.message,
      null,
      2
    )} ${info.stack ? info.stack : ""}`;
  });
}

export class Logger {
  private static loggerInstance: winston.Logger;

  // Start Logger
  static start(appName: string) {
    if (!this.loggerInstance) {
      this.loggerInstance = Logger.createLogger(appName);
    }
  }

  // return logger
  static createLogger(app: string) {
    const logger = winston.createLogger({
      levels: LoggerCustomFormat.customLevels,
      exitOnError: false,
      transports: [
        new winston.transports.Console({
          level: `info`,
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.label({ label: app }),
            winston.format.errors({ stack: true }),
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            LoggerCustomFormat.transformFunction
          ),
        }),
      ],
      format: winston.format.combine(
        winston.format.label({ label: app }),
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        LoggerCustomFormat.transformFunction,
        winston.format.json()
      ),
    });

    return logger;
  }

  // Function to log info
  static info(data: object | string) {
    typeof data === "object"
      ? this.loggerInstance.info(jsonStringify(data))
      : this.loggerInstance.info(data);
  }

  // Function to log debug
  static debug(data: object | string) {
    typeof data === "object"
      ? this.loggerInstance.debug(jsonStringify(data))
      : this.loggerInstance.debug(data);
  }

  // Function to log warn
  static warn(data: object | string) {
    typeof data === "object"
      ? this.loggerInstance.warn(jsonStringify(data))
      : this.loggerInstance.warn(data);
  }

  // Function to log error
  static error(data: Error | object | string) {
    if (!(data instanceof Error)) {
      typeof data === "object"
        ? this.loggerInstance.error(jsonStringify(data))
        : this.loggerInstance.error(data);
    } else {
      this.loggerInstance.error(jsonStringify(data));
      this.loggerInstance.error(data);
    }
  }

  // Function to stop/suppress logging
  static disableLogger() {
    if (this.loggerInstance) {
      this.loggerInstance.transports.forEach((transport) => {
        transport.silent = true;
      });
    }
  }
}
