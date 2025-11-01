/**
 * Logger utilitaire pour le logging uniforme
 * Utilise console avec formatage personnalisé
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message, ...args) => {
    console.log(
      `${colors.blue}[INFO]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${message}`,
      ...args
    );
  },

  success: (message, ...args) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${message}`,
      ...args
    );
  },

  warn: (message, ...args) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${message}`,
      ...args
    );
  },

  error: (message, error, ...args) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${message}`,
      error,
      ...args
    );
  },

  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.magenta}[DEBUG]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${message}`,
        ...args
      );
    }
  },

  http: (method, url, statusCode) => {
    const color = statusCode >= 500 ? colors.red : statusCode >= 400 ? colors.yellow : colors.green;
    console.log(
      `${colors.cyan}[HTTP]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} - ${method} ${url} ${color}${statusCode}${colors.reset}`
    );
  },
};

module.exports = logger;
