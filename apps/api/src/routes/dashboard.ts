import { Hono } from 'hono';
import { prisma } from '@safeguard/database';
import { authMiddleware } from '../middleware/auth';
import { getDashboardSummary, getChildActivities, getSafetyScores } from '../services/dashboard';
import type { Context } from '../types';

const app = new Hono();

app.use('*', authMiddleware);

// Get dashboard summary
app.get('/summary', async (c: Context) => {
  const user = c.get('user');
  
  const summary = await getDashboardSummary(user.familyId);
  
  return c.json({ success: true, data: summary });
});

// Get child activities
app.get('/activities', async (c: Context) => {
  const user = c.get('user');
  
  const activities = await getChildActivities(user.familyId);
  
  return c.json({ success: true, data: activities });
});

// Get safety scores
app.get('/safety-scores', async (c: Context) => {
  const user = c.get('user');
  
  const scores = await getSafetyScores(user.familyId);
  
  return c.json({ success: true, data: scores });
});

// Get recent messages
app.get('/recent-messages', async (c: Context) => {
  const user = c.get('user');
  const limit = parseInt(c.req.query('limit') || '20');
  
  const children = await prisma.child.findMany({
    where: { familyId: user.familyId },
    select: { id: true }
  });
  
  const childIds = children.map(c => c.id);
  
  const messages = await prisma.message.findMany({
    where: { childId: { in: childIds } },
    orderBy: { receivedAt: 'desc' },
    take: limit,
    include: {
      child: { select: { displayName: true } }
    }
  });
  
  return c.json({ success: true, data: messages });
});

// Get alert statistics
app.get('/stats', async (c: Context) => {
  const user = c.get('user');
  const days = parseInt(c.req.query('days') || '30');
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const [
    totalAlerts,
    alertsBySeverity,
    alertsByCategory,
    alertsByStatus,
    resolvedCount
  ] = await Promise.all([
    prisma.alert.count({
      where: { familyId: user.familyId, createdAt: { gte: startDate } }
    }),
    prisma.alert.groupBy({
      by: ['severity'],
      where: { familyId: user.familyId, createdAt: { gte: startDate } },
      _count: { severity: true }
    }),
    prisma.alert.groupBy({
      by: ['category'],
      where: { familyId: user.familyId, createdAt: { gte: startDate } },
      _count: { category: true }
    }),
    prisma.alert.groupBy({
      by: ['status'],
      where: { familyId: user.familyId, createdAt: { gte: startDate } },
      _count: { status: true }
    }),
    prisma.alert.count({
      where: { 
        familyId: user.familyId, 
        status: 'resolved',
        createdAt: { gte: startDate }
      }
    })
  ]);
  
  return c.json({
    success: true,
    data: {
      totalAlerts,
      bySeverity: alertsBySeverity.map(s => ({ severity: s.severity, count: s._count.severity })),
      byCategory: alertsByCategory.map(c => ({ category: c.category, count: c._count.category })),
      byStatus: alertsByStatus.map(s => ({ status: s.status, count: s._count.status })),
      resolvedCount,
      resolutionRate: totalAlerts > 0 ? Math.round((resolvedCount / totalAlerts) * 100) : 0
    }
  });
});

export default app;
