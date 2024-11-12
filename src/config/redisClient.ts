import Redis from 'ioredis';

// Create a Redis client with hard-coded connection details
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Will use 'redis' if in Docker
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
});

export default redisClient;
