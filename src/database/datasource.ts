import { join } from 'path';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const {
  POSTGRES_HOST: host,
  POSTGRES_PORT: port,
  POSTGRES_DB: database,
  POSTGRES_USER: username,
  POSTGRES_PASSWORD: password,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  driver: require('pg'),
  host,
  port: parseInt(port),
  database,
  username,
  password,
  entities: [join(process.cwd(), 'src/**/entities/*.entity.ts')],
  synchronize: false,
  migrations: ['./db/migrations/*.ts'],
  migrationsTransactionMode: 'all',
});
