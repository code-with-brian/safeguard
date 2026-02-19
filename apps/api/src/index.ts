import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { HTTPException } from 'hono/http-exception';

// Import routes
import authRoutes from './routes/auth';
import childrenRoutes from './routes/children';
import contentRoutes from './routes/content';
import alertsRoutes from './routes/alerts';
import dashboardRoutes from './routes/dashboard';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.route('/v1/auth', authRoutes);
app.route('/v1/children', childrenRoutes);
app.route('/v1/content', contentRoutes);
app.route('/v1/alerts', alertsRoutes);
app.route('/v1/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'SafeGuard API',
    version: '1.0.0',
    description: 'Parental Safety Monitoring Platform API',
    documentation: '/v1/docs'
  });
});

// Error handling
app.onError((err, c) => {
  console.error('Error:', err);
  
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: err.message
    }, err.status);
  }
  
  return c.json({
    success: false,
    error: 'Internal server error'
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found'
  }, 404);
});

// Start server
const port = parseInt(process.env.PORT || '3001');

console.log(`🛡️  SafeGuard API starting on port ${port}...`);

export default {
  port,
  fetch: app.fetch
};
