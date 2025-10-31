import { API_CONFIG } from '../service/apiConfig';

/**
 * Logger utility for conditional logging
 * Only logs verbose messages when ENABLE_VERBOSE_LOGGING is true
 */
class Logger {
  private isVerbose: boolean;

  constructor() {
    this.isVerbose = API_CONFIG.ENABLE_VERBOSE_LOGGING || false;
  }

  // Always log errors
  error(...args: any[]) {
    console.error(...args);
  }

  // Only log in verbose mode
  verbose(...args: any[]) {
    if (this.isVerbose) {
      console.log(...args);
    }
  }

  // Info logs (always shown for important info)
  info(...args: any[]) {
    console.log(...args);
  }

  // Debug logs (only in verbose mode)
  debug(...args: any[]) {
    if (this.isVerbose) {
      console.log(...args);
    }
  }

  // Warn logs (always shown)
  warn(...args: any[]) {
    console.warn(...args);
  }
}

export const logger = new Logger();

