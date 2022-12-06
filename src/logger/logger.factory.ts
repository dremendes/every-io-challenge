import { ILogger } from './logger.interface';
import { LoggerMock } from './logger.mock';
import { LoggerService } from './logger.service';

export class LoggerFactory {
  static instance: LoggerService;

  static getInstance(): LoggerService | ILogger {
    if (process.env.NODE_ENV === 'test') {
      return LoggerMock;
    }

    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerService();
    }

    return LoggerFactory.instance;
  }
}
