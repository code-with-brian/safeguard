import { createMiddleware } from 'hono/factory';
import { verify } from 'jsonwebtoken';
import type { Context, User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'safeguard-dev-secret-change-in-production';

export const authMiddleware = createMiddleware<{ Variables: { user: User } }>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized - No token provided' }, 401);
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = verify(token, JWT_SECRET) as User;
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Unauthorized - Invalid token' }, 401);
  }
});

export const generateToken = (user: User): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
};
