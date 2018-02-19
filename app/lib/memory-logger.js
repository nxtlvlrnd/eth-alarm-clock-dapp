import moment from 'moment';

export default class MemoryLogger {
  // 1 - debug / cache
  // 2 - info
  // 3 - error

  constructor(logLevel, logs) {
    this.logLevel = logLevel;
    this.logs = logs;
  }

  cache(message) {
    this.log(`[CACHE] ${message}`);
  }

  info(message) {
    this.log(`[INFO] ${message}`);
  }

  debug(message) {
    this.log(`[DEBUG] ${message}`);
  }

  error(message) {
    this.log(`[ERROR] ${message}`);
  }

  log(message) {
    const timestamp = moment().unix();
    this.logs.push([timestamp, message]);
  }
}