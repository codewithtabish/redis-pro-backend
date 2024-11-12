import Redis from 'ioredis';

const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL) // Use the complete REDIS_URL from Railway
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || '',
      maxRetriesPerRequest: null, // To avoid retry issues in production
      enableReadyCheck: false,
    });

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully.');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

export default redisClient;
