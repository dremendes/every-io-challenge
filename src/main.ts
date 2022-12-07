import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './logger';

async function bootstrap() {
  dotenv.config({ path: '.env' });
  const logger = LoggerFactory.getInstance();
  const { PORT: port } = process.env;

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  await app.listen(port);
  const startupMessage = `Every io challenge: listening on port ${port}\n
      GraphQl Playground: /graphql
      Process ID: ${process.pid}`;

  logger.info(startupMessage);
}
bootstrap();
