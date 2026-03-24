export default () => ({
  nodeEnv:  process.env.NODE_ENV  || 'development',
  port:     parseInt(process.env.PORT || '3001', 10),
  database: { url: process.env.DATABASE_URL },
  redis:    { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  jwt: {
    secret:        process.env.JWT_SECRET         || 'dev_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh',
    expiry:        process.env.JWT_EXPIRY         || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  security: {
    bcryptRounds:  parseInt(process.env.BCRYPT_ROUNDS  || '12', 10),
    throttleTtl:   parseInt(process.env.THROTTLE_TTL   || '60', 10),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    corsOrigins:   process.env.CORS_ORIGINS || 'http://localhost:3000',
  },
});
