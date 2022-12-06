import * as fs from 'fs';
import { ILogger, LogLevel } from './logger.interface';

export class LoggerService implements ILogger {
  writeAccess: boolean;

  infoLogFile: any;

  auditLogFile: any;

  errorLogFile: any;

  level: LogLevel;

  constructor(
    path: string = process.cwd(),
    infoFilename = 'info.log',
    errorFilename = 'error.log',
    auditFilename = 'audit.log',
  ) {
    const infoLogPath = `${path}/${infoFilename}`;
    const errorLogPath = `${path}/${errorFilename}`;
    const auditLogPath = `${path}/${auditFilename}`;

    const logLevelStr = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    this.level = LogLevel[logLevelStr];

    try {
      const FLAG_APPEND_ACCESS = 'a'; // Create if not exists, append if exists

      fs.accessSync(path, fs.constants.W_OK);
      this.infoLogFile = fs.createWriteStream(infoLogPath, {
        flags: FLAG_APPEND_ACCESS,
      });
      this.auditLogFile = fs.createWriteStream(auditLogPath, {
        flags: FLAG_APPEND_ACCESS,
      });
      this.errorLogFile = fs.createWriteStream(errorLogPath, {
        flags: FLAG_APPEND_ACCESS,
      });

      process.stdout.write(`Current Log Level: "${logLevelStr}"\n`);

      this.writeAccess = true;
    } catch (err) {
      this.writeAccess = false;
      process.stdout.write(
        `Unavailable to create log files at ${path} - error: ${err}\n`,
      );
    }
  }

  currentDate = (): string =>
    new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  write = (level: string, message: string, metadata?: any): void => {
    const formattedMessage = this.formatMessage(level, message, metadata);
    process.stdout.write(formattedMessage); // log in terminal

    if (!this.writeAccess || level.toUpperCase() === 'LOG') {
      return;
    }

    const logFiles = {
      AUDIT: this.auditLogFile,
      ERROR: this.errorLogFile,
    };

    const logFile = logFiles[level.toUpperCase()] || this.infoLogFile;

    logFile.write(formattedMessage); // log in
  };

  formatMessage = (level = '', message = '', metadata?: any) =>
    `${level.toUpperCase()}: ${this.currentDate()} - ${message} ${this.formatMetadata(
      metadata,
    )}\n`;

  formatMetadata = (metadata?: any): string => {
    if (!metadata) {
      return '';
    }

    if (metadata.stack) {
      return `\nStackTrace: ${metadata.stack}`;
    }

    return typeof metadata === 'string' ? metadata : JSON.stringify(metadata);
  };

  info = (message: string, metadata?: any): void =>
    this.level >= LogLevel.INFO && this.write('INFO', message, metadata);

  error = (message: string, metadata?: any): void =>
    this.level >= LogLevel.ERROR && this.write('ERROR', message, metadata);

  warn = (message: string, metadata?: any): void =>
    this.level >= LogLevel.WARN && this.write('WARN', message, metadata);

  debug = (message: string, metadata?: any): void =>
    this.level >= LogLevel.DEBUG && this.write('DEBUG', message, metadata);

  trace = (message: string, metadata?: any): void =>
    this.level >= LogLevel.TRACE && this.write('TRACE', message, metadata);

  log = (message: string, metadata?: any): void =>
    this.write('LOG', message, metadata);

  audit = (tag: string, message: string, metadata?: any): void =>
    this.write('AUDIT', `[${tag}] ${message}`, metadata);
}
