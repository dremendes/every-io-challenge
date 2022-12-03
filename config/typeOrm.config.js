"use strict";
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var config_1 = require("@nestjs/config");
var dotenv_1 = require("dotenv");
var graphql_1 = require("graphql");
dotenv_1.config();
var configService = new config_1.ConfigService();
exports["default"] = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [graphql_1.Task]
});
