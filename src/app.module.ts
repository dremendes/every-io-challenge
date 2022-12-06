import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from './logger/logger.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const {
  POSTGRES_HOST: host,
  POSTGRES_PORT: port,
  POSTGRES_DB: database,
  POSTGRES_USER: username,
  POSTGRES_PASSWORD: password,
} = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        driver: require('pg'),
        type: 'postgres',
        host,
        port: parseInt(port),
        database,
        username,
        password,
        autoLoadEntities: true,
        migrationsRun: false,
        entities: [`${__dirname}/src/**/*.entity.js`],
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    TaskModule,
    AuthModule,
    UserModule,
    LoggerModule,
  ],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {
  cli: {
    migrationsDir: string;
  };
}
