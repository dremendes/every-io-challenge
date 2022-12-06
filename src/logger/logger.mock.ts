/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILogger } from './logger.interface';

class CLoggerMock implements ILogger {
  audit(message: string, metadata?: any): void {
    throw new Error('Method not implemented.');
  }

  write = (...args: string[]): any => jest.fn();

  formatMessage = (message: string, ...args: any[]): any => jest.fn();

  formatMetadata = (metadata?: any): any => jest.fn();

  info = (message: string, metadata?: any): any => jest.fn();

  error = (message: string, metadata?: any): any => jest.fn();

  warn = (message: string, metadata?: any): any => jest.fn();

  debug = (message: string, metadata?: any): any => jest.fn();

  trace = (message: string, metadata?: any): any => jest.fn();

  log = (message: string, metadata?: any): any => jest.fn();
}

export const LoggerMock = new CLoggerMock();
