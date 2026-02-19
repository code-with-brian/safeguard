import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@safeguard/database';
import { authMiddleware } from '../middleware/auth';
import { getAlertTrends } from '../services/alerts';
import type { Context } from '../types';

const app = new Hono();

app.use('*', authMiddleware);

// Validation schemas
const acknowledgeSchema = z.object({
  notes: z.string().optional()
});

const alertFiltersSchema = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  status: z.enum(['new', 'acknowledged', 'resolved', 'false_positive']).optional(),
  childId: z.string().uuid().optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
});

// List alerts
app.get('/', zValidator('query', alertFiltersSchema), async (c: Context) => {
  const user = c.get('user');
  const filters = c.req.valid('query');
  
  const where: any = { familyId: user.familyId };
  
  if (filters.severity) where.severity = filters.severity;
  if (filters.status) where.status = filters.status;
  if (filters.childId) where.childId = filters.childId;
  if (filters.category) where.category = filters.category;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }
  
  const skip = (filters.page - 1) * filters.pageSize;
  
  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: filters.pageSize,
      include: { child: { select: { displayName: true } } }
    }),
    prisma.alert.count({ where })
  ]);
  
  return c.json({
    success: true,
    data: {
      items: alerts,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      hasMore: total > skip + alerts.length
    }
  });
});

// Get alert by ID
app.get('/:id', async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  const alert = await prisma.alert.findFirst({
    where: { id, familyId: user.familyId },
    include: {
      child: true,
      acknowledgedByUser: {
        select: { firstName: true, lastName: true }
      }
    }
  });
  
  if (!alert) {
    return c.json({ success: false, error: 'Alert not found' }, 404);
  }
  
  return c.json({ success: true, data: alert });
});

// Acknowledge alert
app.post('/:id/acknowledge', zValidator('json', acknowledgeSchema), async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  const alert = await prisma.alert.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!alert) {
    return c.json({ success: false, error: 'Alert not found' }, 404);
  }
  
  const updated = await prisma.alert.update({
    where: { id },
    data: {
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      acknowledgedBy: user.id,
      parentNotes: data.notes
    }
  });
  
  return c.json({ success: true, data: updated });
});

// Resolve alert
app.post('/:id/resolve', zValidator('json', acknowledgeSchema), async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  const alert = await prisma.alert.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!alert) {
    return c.json({ success: false, error: 'Alert not found' }, 404);
  }
  
  const updated = await prisma.alert.update({
    where: { id },
    data: {
      status: 'resolved',
      acknowledgedAt: new Date(),
      acknowledgedBy: user.id,
      parentNotes: data.notes
    }
  });
  
  return c.json({ success: true, data: updated });
});

// Mark as false positive
app.post('/:id/false-positive', zValidator('json', acknowledgeSchema), async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  const alert = await prisma.alert.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!alert) {
    return c.json({ success: false, error: 'Alert not found' }, 404);
  }
  
  const updated = await prisma.alert.update({
    where: { id },
    data: {
      status: 'false_positive',
      acknowledgedAt: new Date(),
      acknowledgedBy: user.id,
      parentNotes: data.notes
    }
  });
  
  return c.json({ success: true, data: updated });
});

// Add note to alert
app.post('/:id/note', zValidator('json', z.object({ notes: z.string() })), async (c: Context) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  const alert = await prisma.alert.findFirst({
    where: { id, familyId: user.familyId }
  });
  
  if (!alert) {
    return c.json({ success: false, error: 'Alert not found' }, 404);
  }
  
  const updated = await prisma.alert.update({
    where: { id },
    data: { parentNotes: data.notes }
  });
  
  return c.json({ success: true, data: updated });
});

// Get alert trends
app.get('/stats/trends', async (c: Context) => {
  const user = c.get('user');
  const days = parseInt(c.req.query('days') || '30');
  
  const trends = await getAlertTrends(user.familyId, days);
  
  return c.json({ success: true, data: trends });
});

export default app;
