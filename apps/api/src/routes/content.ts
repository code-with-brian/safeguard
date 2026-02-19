import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prisma } from '@safeguard/database';
import { authMiddleware } from '../middleware/auth';
import { moderateContent, calculateSafetyScore } from '../services/moderation';
import { createAlertFromMessage } from '../services/alerts';
import type { Context } from '../types';

const app = new Hono();

// Content submission is typically from device agents, not authenticated parents
// But for demo purposes, we'll allow authenticated access too

const submitMessageSchema = z.object({
  childId: z.string().uuid(),
  content: z.string(),
  contentType: z.enum(['text', 'image', 'video']).default('text'),
  sourceApp: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderType: z.enum(['contact', 'unknown', 'group']).default('unknown'),
  conversationId: z.string(),
  sentAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional()
});

const submitImageSchema = z.object({
  childId: z.string().uuid(),
  imageUrl: z.string().url(),
  sourceApp: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  conversationId: z.string(),
  metadata: z.record(z.any()).optional()
});

const submitLocationSchema = z.object({
  childId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  timestamp: z.string().datetime().optional()
});

const submitAppUsageSchema = z.object({
  childId: z.string().uuid(),
  appName: z.string(),
  packageName: z.string(),
  duration: z.number(), // in seconds
  startTime: z.string().datetime()
});

// Submit message for analysis
app.post('/message', zValidator('json', submitMessageSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // Verify child exists
    const child = await prisma.child.findUnique({
      where: { id: data.childId }
    });
    
    if (!child) {
      return c.json({ success: false, error: 'Child not found' }, 404);
    }
    
    // Create message record
    const message = await prisma.message.create({
      data: {
        childId: data.childId,
        content: data.content,
        contentType: data.contentType,
        sourceApp: data.sourceApp,
        senderId: data.senderId,
        senderName: data.senderName,
        senderType: data.senderType,
        conversationId: data.conversationId,
        sentAt: data.sentAt ? new Date(data.sentAt) : new Date(),
        moderationStatus: 'pending'
      }
    });
    
    // Run moderation
    const moderationResult = await moderateContent(
      data.content,
      child,
      {
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderType: data.senderType,
        sourceApp: data.sourceApp,
        timestamp: data.sentAt ? new Date(data.sentAt) : new Date()
      }
    );
    
    // Update message with moderation results
    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: {
        moderationStatus: moderationResult.action === 'block' ? 'blocked' : moderationResult.action === 'flag' ? 'flagged' : 'safe',
        vettlyDecisionId: moderationResult.decisionId,
        severityScore: moderationResult.severityScore,
        flaggedCategories: moderationResult.categories
      }
    });
    
    // Create alert if needed
    let alert = null;
    if (moderationResult.severityScore >= 40) {
      alert = await createAlertFromMessage(updatedMessage, child, moderationResult);
    }
    
    // Update child's safety score
    const recentMessages = await prisma.message.findMany({
      where: { childId: child.id },
      orderBy: { receivedAt: 'desc' },
      take: 100
    });
    
    const recentAlerts = await prisma.alert.findMany({
      where: { childId: child.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    const newSafetyScore = calculateSafetyScore(recentMessages, recentAlerts);
    await prisma.child.update({
      where: { id: child.id },
      data: { safetyScore: newSafetyScore }
    });
    
    return c.json({
      success: true,
      data: {
        message: updatedMessage,
        moderation: moderationResult,
        alert: alert ? { id: alert.id, severity: alert.severity } : null
      }
    }, 201);
  } catch (error) {
    console.error('Message submission error:', error);
    return c.json({ success: false, error: 'Failed to process message' }, 500);
  }
});

// Submit image for analysis
app.post('/image', zValidator('json', submitImageSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    const child = await prisma.child.findUnique({
      where: { id: data.childId }
    });
    
    if (!child) {
      return c.json({ success: false, error: 'Child not found' }, 404);
    }
    
    // In production, this would call Vettly image analysis API
    // For now, create a placeholder message
    const message = await prisma.message.create({
      data: {
        childId: data.childId,
        content: `[Image] ${data.imageUrl}`,
        contentType: 'image',
        sourceApp: data.sourceApp,
        senderId: data.senderId,
        senderName: data.senderName,
        senderType: 'unknown',
        conversationId: data.conversationId,
        moderationStatus: 'safe'
      }
    });
    
    return c.json({
      success: true,
      data: { message }
    }, 201);
  } catch (error) {
    console.error('Image submission error:', error);
    return c.json({ success: false, error: 'Failed to process image' }, 500);
  }
});

// Submit location update
app.post('/location', zValidator('json', submitLocationSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    const child = await prisma.child.findUnique({
      where: { id: data.childId }
    });
    
    if (!child) {
      return c.json({ success: false, error: 'Child not found' }, 404);
    }
    
    // Update or create device session
    const session = await prisma.deviceSession.create({
      data: {
        childId: data.childId,
        locationLat: data.latitude,
        locationLng: data.longitude,
        startedAt: data.timestamp ? new Date(data.timestamp) : new Date()
      }
    });
    
    return c.json({
      success: true,
      data: { session }
    }, 201);
  } catch (error) {
    console.error('Location submission error:', error);
    return c.json({ success: false, error: 'Failed to process location' }, 500);
  }
});

// Submit app usage
app.post('/app-usage', zValidator('json', submitAppUsageSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    const child = await prisma.child.findUnique({
      where: { id: data.childId }
    });
    
    if (!child) {
      return c.json({ success: false, error: 'Child not found' }, 404);
    }
    
    // Log app usage (could be stored in a separate table in production)
    console.log(`[App Usage] ${child.displayName}: ${data.appName} for ${data.duration}s`);
    
    return c.json({
      success: true,
      message: 'App usage logged'
    });
  } catch (error) {
    console.error('App usage submission error:', error);
    return c.json({ success: false, error: 'Failed to log app usage' }, 500);
  }
});

export default app;
