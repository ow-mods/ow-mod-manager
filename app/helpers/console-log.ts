/* eslint-disable no-console */
const isProduction = process.env.NODE_ENV === 'production';

type ConsoleLog = typeof console.log;

const log = (method: ConsoleLog): ConsoleLog => (
  ...params: Parameters<ConsoleLog>
) => {
  if (isProduction) {
    return;
  }

  method(params);
};

export const debugConsole = {
  log: log(console.log),
  warn: log(console.warn),
  error: log(console.error),
};
