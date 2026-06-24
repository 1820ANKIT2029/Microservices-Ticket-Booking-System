const isDev = process.env.NODE_ENV !== "production";
const PREFIX = "[EventPass]";

export class LoggerUtils {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `${PREFIX} [${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  static info(message: string, ...args: unknown[]) {
    if (isDev) {
      console.info(this.formatMessage("info", message), ...args);
    }
  }

  static warn(message: string, ...args: unknown[]) {
    console.warn(this.formatMessage("warn", message), ...args);
  }

  static error(message: string, ...args: unknown[]) {
    console.error(this.formatMessage("error", message), ...args);
  }

  static debug(message: string, ...args: unknown[]) {
    if (isDev) {
      console.debug(this.formatMessage("debug", message), ...args);
    }
  }
}
