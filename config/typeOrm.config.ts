function TypeOrmConfig() {
  const {
    POSTGRES_HOST: host,
    POSTGRES_PORT: port,
    POSTGRES_DB: database,
    POSTGRES_USER: username,
    POSTGRES_PASSWORD: password,
  } = process.env;

  const migrationsDir = 'db/migrations';

  return {
    type: 'postgres',
    host,
    port,
    database,
    username,
    password,
    entities: [`${__dirname}/src/**/*.entity.ts`],
    migrations: [`${migrationsDir}/**/*.ts`],
    migrationsRun: false,
    applicationName: "Every IO Challenge",
    dropSchema: false,
    logging: false,
    autoSchemaSync: false,
    migrationsTableName: 'migrations',
    cli: {
      migrationsDir,
    },
  };
}

module.exports = TypeOrmConfig();
