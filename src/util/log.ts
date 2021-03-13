enum LogLevel {
  ERROR = "ERROR",
  WARNING = "WARN",
  DEBUG = "DEBUG",
  PING = "PING",
  TIME = "TIME",
}

const logLevelColors = {
  [LogLevel.ERROR]: "red",
  [LogLevel.WARNING]: "orange",
  [LogLevel.DEBUG]: "green",
  [LogLevel.PING]: "green",
  [LogLevel.TIME]: "green",
};

export const log = (level: LogLevel, msg: string, object?: any) => {
  if (process.env.NODE_ENV === "test") return;

  if (process.env.REACT_APP_LOG_LEVELS?.split(",").includes(level)) {
    console.log(
      "%c" + level + "%c\n" + msg,
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

export const logPing = (msg: string, object?: any) =>
  log(LogLevel.PING, msg, object);

export const logTime = (msg: string, fn: () => any) => {
  const start = new Date().getTime();
  fn();
  log(LogLevel.TIME, msg, `Took ${new Date().getTime() - start} ms.`);
};
