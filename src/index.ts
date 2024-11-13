// app.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import { isDbConnected, testConnection } from './config/database'; // Database connection
import redisClient from './config/redisClient'; // Redis client
import userRouter from './routes/user-router';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());
app.use('/api/v1/user', userRouter);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express this is test route!');
});

app.get('/set-redis', async (req: Request, response: Response) => {
  try {
    const result = await redisClient.set('mobile', 'iphone'); // No expiration

    return response
      .status(200)
      .json({ message: 'added in redis phone', data: result });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});
app.get('/get-redis', async (req: Request, response: Response) => {
  try {
    const result = await redisClient.get('mobile');
    return response
      .status(200)
      .json({ message: 'added in redis', data: result });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

// Error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exits the process with failure code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exits the process with failure code
});

// Start the server
app
  .listen(PORT, async () => {
    try {
      // Test database connection first
      // Test database connection only if not already connected
      if (!isDbConnected()) {
        await testConnection(); // Test the database connection if not already connected
      } else {
        console.log('⚠️ Database is already connected.');
      }

      // Then connect to Redis after the database connection
      // Check if Redis is already connected or connecting
      // Check if Redis client is already connecting/connected before trying to connect
      if (
        redisClient.status !== 'ready' &&
        redisClient.status !== 'connecting' &&
        redisClient.status !== 'reconnecting'
      ) {
        await redisClient.connect();
        console.log('✅ Redis connected successfully.');
      } else {
        console.log(
          '⚠️ Redis is already connected or in the process of connecting.',
        );
      }

      // Start the server once both DB and Redis are connected
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      process.exit(1); // Exit the process if any error occurs during startup
    }
  })
  .on('error', (err) => {
    console.error('❌ Error starting server:', err.message);
  });

//   3c285c87cdf14f6fa79bf4677771d73a
