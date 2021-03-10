enum LogLevel {
  ERROR = "ERR",
  WARNING = "WRN",
  DEBUG = "DBG",
}

const logLevelColors = {
  [LogLevel.ERROR]: "red",
  [LogLevel.WARNING]: "orange",
  [LogLevel.DEBUG]: "green",
};

export const log = (level: LogLevel, msg: string, object?: any) => {
  if (process.env.REACT_APP_LOG_LEVELS?.includes(level)) {
    console.log(
      "%c" + level + "%c\t" + msg,
      `color: ${logLevelColors[level]}; `,
      ""
    );
    if (object) {
      console.log(object);
    }
  }
};

export const logError = (msg: string, object?: any) =>
  log(LogLevel.ERROR, msg, object);

export const logWarning = (msg: string, object?: any) =>
  log(LogLevel.WARNING, msg, object);

export const logDebug = (msg: string, object?: any) =>
  log(LogLevel.DEBUG, msg, object);
