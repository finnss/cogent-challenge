import config from '/config';

const logLevel = {
  ERROR: { level: 0, logger: (...args) => console.error(...args), style: 'background: red; color: white;' },
  WARN: { level: 1, logger: (...args) => console.warn(...args), style: 'background: orangered; color: white;' },
  INFO: { level: 2, logger: (...args) => console.info(...args), style: 'background: lightcyan;' },
  DEBUG: { level: 3, logger: (...args) => console.log(...args), style: 'background: yellow;' },
  TRACE: { level: 4, logger: (...args) => console.log(...args), style: 'background: palegreen;' },
};

const readableLogLevel = {
  [logLevel.ERROR.level]: 'ERROR',
  [logLevel.WARN.level]: 'WARN',
  [logLevel.INFO.level]: 'INFO',
  [logLevel.DEBUG.level]: 'DEBUG',
  [logLevel.TRACE.level]: 'TRACE',
};

const configuredLevel = logLevel[config.LOG_LEVEL.toUpperCase()].level;

function log(level, tag, text, args) {
  if (configuredLevel >= level.level) {
    let str = `%c${readableLogLevel[level.level]}`;

    if (tag) str += ` ${tag}`;
    str += `%c ${text}`;

    level.logger(str, level.style, '', ...args);
  }
}

function getLogger(tag) {
  return {
    error: (text, ...args) => log(logLevel.ERROR, tag, text, args),
    warn: (text, ...args) => log(logLevel.WARN, tag, text, args),
    info: (text, ...args) => log(logLevel.INFO, tag, text, args),
    debug: (text, ...args) => log(logLevel.DEBUG, tag, text, args),
    trace: (text, ...args) => log(logLevel.TRACE, tag, text, args),
  };
}

const defaultLogger = getLogger();

export { defaultLogger, getLogger };
