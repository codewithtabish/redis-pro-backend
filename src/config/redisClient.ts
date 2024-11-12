import Redis from 'ioredis';

// Create a Redis client with hard-coded connection details
const redisClient = new Redis({
  host: process.env.REDIS_HOST, // String: Redis host (e.g., 'localhost' or a service URL)
  //   host: 'localhost', // String: Redis host (e.g., 'localhost' or a service URL)
  port: parseInt(process.env.REDIS_PORT || '6379', 10), // Number: Redis port, ensure it's parsed from string
  password: process.env.REDIS_PASSWORD, // String: Redis password (if set)
});

export default redisClient;
