import { Request, Response } from 'express';
import { db } from '../config/db';
import Tables from '../models';
import redisClient from '../config/redisClient';
import { eq } from 'drizzle-orm';

// Signup method
export const signup = async (req: Request, res: Response) => {
  try {
    const { clerkId, name, email, isStudent, isAdmin } = req.body;

    // Validate the incoming data
    if (!clerkId || !name || !email) {
      return res
        .status(400)
        .json({ message: 'Clerk ID, name, and email are required' });
    }

    // Check if the email or clerkId already exists
    // const existingUser = await db
    //   .select()
    //   .from('users')
    //   .where(eq(Tables.Users.email, email))
    //   .first();
    // //   .orWhere(eq(Tables.Users.clerkId, clerkId)) // Check if clerkId already exists

    // //   .first();

    // if (existingUser) {
    //   return res
    //     .status(409)
    //     .json({ message: 'User with this email or clerk ID already exists' });
    // }

    // Insert the new user into the database
    const newUser = await db
      .insert(Tables.Users)
      .values({
        clerkId,
        name,
        email,
        isStudent: isStudent || false,
        isAdmin: isAdmin || false,
      })
      .returning();

    // Clear the users cache in Redis after successful signup
    await redisClient.del('users'); // Remove the cached users data

    console.log('User signed up and cached data cleared');
    return res.status(201).json({
      message: 'User signed up successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error during signup:', error.message);
    return res
      .status(500)
      .json({ message: 'Error during signup', error: error.message });
  }
};

// Get all users method
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Check if the users data exists in Redis
    const cachedUsers = await redisClient.get('users');

    if (cachedUsers) {
      // If found in Redis, return the cached data
      console.log('Users fetched from Redis');
      return res.status(200).json({
        message: 'Users fetched from Redis',
        data: JSON.parse(cachedUsers),
      });
    }

    // If not found in Redis, fetch the users from the database
    const users = await db.select().from(Tables.Users);

    // Store the fetched users in Redis with an expiration time (e.g., 1 hour)
    await redisClient.set('users', JSON.stringify(users)); // 1 hour expiry

    console.log('Users fetched from database and stored in Redis');
    return res
      .status(200)
      .json({ message: 'Users fetched from database', data: users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message });
  }
};
