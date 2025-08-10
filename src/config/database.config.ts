import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config({ quiet: true });

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
}));