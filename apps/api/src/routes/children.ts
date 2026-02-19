import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@safeguard/database';
import { authMiddleware } from '../middleware/auth';
import type { Context } from '../types';

const app = new Hono();

app.use('*', authMiddleware);

// Validation schemas
const createChildSchema = z.object({
  displayName: z.string().min(1),
  birthDate: z.string().datetime().optional(),
  deviceType: z.enum(['ios', 'android']).optional(),
  deviceId: z.string().optional()
});

const updateChildSchema = z.object({
  displayName: z.string().min(1).optional(),
  birthDate: z.string().datetime().optional(),
  alertThreshold: z.enum(['low', 'medium', 'high']).optional(),
  monitoredApps: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

// List children
app.get('/', async (c: Context) => {
  const user = c.get('user');
  
  const children = await prisma.child.findMany({
    where: { familyId: user.familyId },
    orderBy: { createdAt: 'desc' }
  });
  
  return c.json({ success: true, data: children });
});

// Get child by ID
app.get('/:id', async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  const child = await prisma.child.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!child) {
    return c.json({ success: false, error: 'Child not found' }, 404);
  }
  
  return c.json({ success: true, data: child });
});

// Create child
app.post('/', zValidator('json', createChildSchema), async (c: Context) => {
  const user = c.get('user');
  const data = c.req.valid('json');
  
  const child = await prisma.child.create({
    data: {
      familyId: user.familyId,
      displayName: data.displayName,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      deviceType: data.deviceType,
      deviceId: data.deviceId
    }
  });
  
  return c.json({ success: true, data: child }, 201);
});

// Update child
app.put('/:id', zValidator('json', updateChildSchema), async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  const existing = await prisma.child.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!existing) {
    return c.json({ success: false, error: 'Child not found' }, 404);
  }
  
  const child = await prisma.child.update({
    where: { id },
    data: {
      displayName: data.displayName,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      alertThreshold: data.alertThreshold,
      monitoredApps: data.monitoredApps,
      isActive: data.isActive
    }
  });
  
  return c.json({ success: true, data: child });
});

// Delete child
app.delete('/:id', async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  const existing = await prisma.child.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!existing) {
    return c.json({ success: false, error: 'Child not found' }, 404);
  }
  
  await prisma.child.delete({ where: { id } });
  
  return c.json({ success: true, message: 'Child deleted' });
});

// Get child activity
app.get('/:id/activity', async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  const child = await prisma.child.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!child) {
    return c.json({ success: false, error: 'Child not found' }, 404);
  }
  
  const messages = await prisma.message.findMany({
    where: { childId: id },
    orderBy: { receivedAt: 'desc' },
    take: 50
  });
  
  const alerts = await prisma.alert.findMany({
    where: { childId: id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  const sessions = await prisma.deviceSession.findMany({
    where: { childId: id },
    orderBy: { startedAt: 'desc' },
    take: 10
  });
  
  return c.json({
    success: true,
    data: {
      messages,
      alerts,
      sessions
    }
  });
});

// Get wellbeing report
app.get('/:id/wellbeing', async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  const child = await prisma.child.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!child) {
    return c.json({ success: false, error: 'Child not found' }, 404);
  }
  
  const snapshots = await prisma.wellbeingSnapshot.findMany({
    where: { childId: id },
    orderBy: { snapshotDate: 'desc' },
    take: 30
  });
  
  const recentMessages = await prisma.message.findMany({
    where: { childId: id },
    orderBy: { receivedAt: 'desc' },
    take: 100
  });
  
  return c.json({
    success: true,
    data: {
      snapshots,
      recentActivity: recentMessages
    }
  });
});

export default app;
