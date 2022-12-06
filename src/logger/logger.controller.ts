import * as fs from 'fs';
import { Controller, Get, Header, Param, Res, StreamableFile } from '@nestjs/common';
import { join } from 'path';
import { Tail } from 'tail';
import { LoggerService } from './logger.service';

@Controller('log')
export class LoggerController {
  constructor(public readonly service: LoggerService) {}

  @Get('/:filename')
  @Header('Cache-Control', 'no-cache')
  @Header('Content-Type', 'text/event-stream')
  @Header('Connection', 'keep-alive')
  getFilename(
    @Res({ passthrough: true }) res,
    @Param('filename') filename: string,
  ) {
    const file = fs.createReadStream(join(process.cwd(), `${filename}.log`));
    return new StreamableFile(file);
  }
}
