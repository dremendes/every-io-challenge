export interface ILogger {
  write(level: string, message: string, metadata?: any): void;

  info(message: string, metadata?: any): void;
  error(message: string, metadata?: any): void;
  warn(message: string, metadata?: any): void;
  debug(message: string, metadata?: any): void;
  trace(message: string, metadata?: any): void;
  log(message: string, metadata?: any): void;
  audit(tag: string, message: string, metadata?: any): void;
}

export enum LogLevel {
  SILENT = 0,
  OFF = 0,
  ERROR = 1,
  TRACE = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  VERBOSE = 6,
  ALL = 6,
}
