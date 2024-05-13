import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => {
  const dbConfig = {
    db: process.env.URI_MONGODB,
    env: process.env.NODE_ENV || 'local',
  };
  return dbConfig;
});
