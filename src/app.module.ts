import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dotenv = require('dotenv');

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
    }),
    TaskModule,
  ],
})
export class AppModule {
  cli: {
    migrationsDir: string;
  };
}
