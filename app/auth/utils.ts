import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { z } from 'zod/v4';

/**
 * Hashes a password using bcrypt
 * @param password - The password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

/**
 * Compares a password with a hashed password using bcrypt
 * @param password - The password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns True if the password matches the hashed password, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword);
};

/**
 * Generates a JWT token
 * @param data - The data to sign
 * @returns The signed token
 */
export const generateToken = (data: { uuid: string; email: string; username: string }) => {
  return sign(data, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1d' });
};

/**
 * Processes a Zod error
 * @param error - The Zod error to process
 * @returns The processed error
 */
export const processError = (error: z.ZodError) => {
  return z
    .prettifyError(error)
    .split('\n')
    .filter((line) => !line.trim().startsWith('→'))
    .join(';');
};
