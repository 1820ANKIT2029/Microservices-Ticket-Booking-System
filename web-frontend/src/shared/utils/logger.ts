const isDev = process.env.NODE_ENV !== "production";
const PREFIX = "[EventPass]";

const formatMessage = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  return `${PREFIX} [${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(formatMessage("info", message), ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage("warn", message), ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage("error", message), ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(formatMessage("debug", message), ...args);
    }
  },
};
