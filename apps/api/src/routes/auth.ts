import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@safeguard/database';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from '../middleware/auth';
import type { Context } from '../types';

const app = new Hono();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  familyName: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register
app.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return c.json({ success: false, error: 'User already exists' }, 409);
    }
    
    // Create family
    const family = await prisma.family.create({
      data: { name: data.familyName }
    });
    
    // Hash password
    const passwordHash = await hashPassword(data.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        familyId: family.id,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      }
    });
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      familyId: user.familyId,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          familyId: user.familyId
        },
        token
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ success: false, error: 'Registration failed' }, 500);
  }
});

// Login
app.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (!user) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    const isValid = await verifyPassword(data.password, user.passwordHash);
    
    if (!isValid) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      familyId: user.familyId,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          familyId: user.familyId
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: 'Login failed' }, 500);
  }
});

// Get current user
app.get('/me', authMiddleware, async (c: Context) => {
  const user = c.get('user');
  
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      notificationPreferences: true,
      familyId: true,
      createdAt: true
    }
  });
  
  if (!userData) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }
  
  return c.json({ success: true, data: userData });
});

// Refresh token
app.post('/refresh', authMiddleware, async (c: Context) => {
  const user = c.get('user');
  
  const newToken = generateToken(user);
  
  return c.json({
    success: true,
    data: { token: newToken }
  });
});

export default app;
