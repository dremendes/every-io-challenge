import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};
