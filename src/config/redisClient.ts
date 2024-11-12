import Redis from 'ioredis';

// Check if REDIS_URL is available from environment variables
const redisClient = process.env.REDIS_URL
  ? new Redis(
      'redis://default:QXEHFhzcdgzmhItcYZHCRlFQFAxmsQVH@autorack.proxy.rlwy.net:31881',
    ) // Use the complete REDIS_URL from Railway (or any Redis provider)
  : new Redis({
      host: process.env.REDISHOST || 'localhost', // Use REDISHOST environment variable, fallback to 'localhost'
      port: parseInt(process.env.REDIS_PORT || '6379', 10), // Use REDIS_PORT, fallback to default Redis port 6379
      password: process.env.REDIS_PASSWORD || '', // Use REDIS_PASSWORD, fallback to empty if not set
      db: parseInt(process.env.REDIS_DB || '0', 10), // Default to database 0 if REDIS_DB is not set
      maxRetriesPerRequest: null, // Disable retries to avoid blocking requests
      enableReadyCheck: false, // Disable the ready check to avoid unnecessary waiting
    });

// Log success when connected
redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully.');
});

// Log errors if Redis connection fails
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

export default redisClient;
