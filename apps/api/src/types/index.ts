import { Context as HonoContext } from 'hono';

export interface User {
  id: string;
  email: string;
  familyId: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Variables {
  user: User;
}

export type Context = HonoContext<{ Variables: Variables }>;

// Request/Response types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  familyName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateChildRequest {
  displayName: string;
  birthDate?: string;
  deviceType?: 'ios' | 'android';
  deviceId?: string;
}

export interface UpdateChildRequest {
  displayName?: string;
  birthDate?: string;
  alertThreshold?: 'low' | 'medium' | 'high';
  monitoredApps?: string[];
  isActive?: boolean;
}

export interface SubmitMessageRequest {
  content: string;
  contentType?: 'text' | 'image' | 'video';
  sourceApp: string;
  senderId: string;
  senderName: string;
  senderType?: 'contact' | 'unknown' | 'group';
  conversationId: string;
  sentAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AcknowledgeAlertRequest {
  notes?: string;
}

export interface AlertFilters {
  severity?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'new' | 'acknowledged' | 'resolved' | 'false_positive';
  childId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
