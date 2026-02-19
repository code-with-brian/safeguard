// Shared types and constants for SafeGuard

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'false_positive';
export type ContentType = 'text' | 'image' | 'video';
export type ModerationStatus = 'pending' | 'safe' | 'flagged' | 'blocked';
export type DeviceType = 'ios' | 'android';
export type SubscriptionTier = 'free' | 'premium' | 'family';

export interface AlertCategory {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  color: string;
}

export const ALERT_CATEGORIES: AlertCategory[] = [
  { id: 'self_harm', name: 'Self-Harm', description: 'Indicators of self-harm ideation', severity: 'critical', color: '#DC2626' },
  { id: 'suicidal_ideation', name: 'Suicidal Ideation', description: 'Signs of suicidal thoughts', severity: 'critical', color: '#7F1D1D' },
  { id: 'grooming', name: 'Grooming', description: 'Potential grooming behavior detected', severity: 'critical', color: '#991B1B' },
  { id: 'cyberbullying', name: 'Cyberbullying', description: 'Bullying or harassment detected', severity: 'high', color: '#EA580C' },
  { id: 'sexual_content', name: 'Sexual Content', description: 'Inappropriate sexual content', severity: 'high', color: '#C2410C' },
  { id: 'violence', name: 'Violence/Threats', description: 'Violent language or threats', severity: 'high', color: '#9A3412' },
  { id: 'drugs', name: 'Drugs/Alcohol', description: 'Drug or alcohol references', severity: 'medium', color: '#D97706' },
  { id: 'hate_speech', name: 'Hate Speech', description: 'Hateful or discriminatory language', severity: 'medium', color: '#B45309' },
  { id: 'inappropriate_language', name: 'Inappropriate Language', description: 'Mild inappropriate language', severity: 'low', color: '#6B7280' },
];

export interface MessageContext {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'contact' | 'unknown' | 'group';
  sourceApp: string;
  timestamp: Date;
}

export interface ModerationResult {
  decisionId: string;
  action: 'allow' | 'flag' | 'block';
  severityScore: number;
  categories: string[];
  confidence: number;
  reasoning: string;
}

export interface SafetyScore {
  overall: number;
  mood: number;
  social: number;
  sleep: number;
  trend: 'up' | 'down' | 'stable';
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Dashboard types
export interface DashboardSummary {
  totalChildren: number;
  activeAlerts: number;
  criticalAlerts: number;
  averageSafetyScore: number;
  recentAlerts: AlertSummary[];
}

export interface AlertSummary {
  id: string;
  childId: string;
  childName: string;
  severity: Severity;
  category: string;
  title: string;
  createdAt: Date;
  status: AlertStatus;
}

export interface ChildActivity {
  childId: string;
  childName: string;
  deviceStatus: 'online' | 'offline';
  lastSeen: Date;
  messageCount: number;
  alertCount: number;
  safetyScore: number;
}

// Wellbeing report types
export interface WellbeingReport {
  childId: string;
  childName: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  overallScore: number;
  moodTrend: number[];
  socialActivity: {
    healthy: number;
    concerning: number;
  };
  sleepPattern: {
    averageBedtime: string;
    lateNightActivity: number;
  };
  topConcerns: string[];
  recommendations: string[];
}
