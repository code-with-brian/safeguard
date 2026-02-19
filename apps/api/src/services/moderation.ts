import type { Message, Child } from '@safeguard/database';
import type { ModerationResult, MessageContext } from '@safeguard/shared';

// Mock Vettly integration - in production, this would call the actual Vettly API
export async function moderateContent(
  content: string,
  child: Child,
  context: MessageContext
): Promise<ModerationResult> {
  // Get conversation history for context (last 10 messages)
  const { prisma } = await import('@safeguard/database');
  
  const conversationHistory = await prisma.message.findMany({
    where: { conversationId: context.conversationId },
    orderBy: { receivedAt: 'desc' },
    take: 10
  });

  // Simulate AI moderation analysis
  const result = await simulateVettlyAnalysis(content, child, context, conversationHistory);
  
  return result;
}

async function simulateVettlyAnalysis(
  content: string,
  child: Child,
  context: MessageContext,
  history: Message[]
): Promise<ModerationResult> {
  const lowerContent = content.toLowerCase();
  const hour = new Date(context.timestamp).getHours();
  
  // Critical keywords
  const criticalPatterns = [
    { pattern: /kill\s+myself|suicide|end\s+it\s+all|can't\s+go\s+on/i, category: 'suicidal_ideation', baseScore: 85 },
    { pattern: /cut\s+myself|self.?harm|hurt\s+myself/i, category: 'self_harm', baseScore: 80 },
    { pattern: /send\s+(?:nudes?|pics?)|meet\s+(?:up|somewhere)|don't\s+tell\s+(?:mom|dad|parents)/i, category: 'grooming', baseScore: 75 },
  ];
  
  // High priority patterns
  const highPatterns = [
    { pattern: /hate\s+you|you're\s+ugly|everyone\s+hates\s+you|kill\s+yourself/i, category: 'cyberbullying', baseScore: 70 },
    { pattern: /send\s+(?:address|phone|number)|how\s+old\s+are\s+you.*\?/i, category: 'grooming', baseScore: 65 },
  ];
  
  // Medium priority patterns
  const mediumPatterns = [
    { pattern: /stupid|idiot|loser|shut\s+up/i, category: 'inappropriate_language', baseScore: 40 },
    { pattern: /weed|drugs?|pills?|high/i, category: 'drugs', baseScore: 45 },
  ];
  
  let maxScore = 0;
  let detectedCategories: string[] = [];
  let action: 'allow' | 'flag' | 'block' = 'allow';
  let reasoning = 'No concerning content detected';
  
  // Check critical patterns
  for (const { pattern, category, baseScore } of criticalPatterns) {
    if (pattern.test(content)) {
      let score = baseScore;
      // Increase score for late night messages (11pm - 5am)
      if (hour >= 23 || hour <= 5) score += 10;
      // Increase score based on conversation context
      if (history.some(m => m.severityScore && m.severityScore > 50)) score += 5;
      
      if (score > maxScore) {
        maxScore = score;
        detectedCategories = [category];
        action = score > 80 ? 'block' : 'flag';
        reasoning = `Detected ${category.replace('_', ' ')} indicators with ${Math.round(score)}% confidence`;
      }
    }
  }
  
  // Check high patterns
  for (const { pattern, category, baseScore } of highPatterns) {
    if (pattern.test(content)) {
      let score = baseScore;
      if (hour >= 23 || hour <= 5) score += 5;
      
      if (score > maxScore) {
        maxScore = score;
        detectedCategories = [category];
        action = 'flag';
        reasoning = `Detected ${category.replace('_', ' ')} patterns with ${Math.round(score)}% confidence`;
      }
    }
  }
  
  // Check medium patterns
  for (const { pattern, category, baseScore } of mediumPatterns) {
    if (pattern.test(content)) {
      let score = baseScore;
      if (score > maxScore && maxScore < 50) {
        maxScore = score;
        detectedCategories = [category];
        action = 'allow';
        reasoning = `Minor ${category.replace('_', ' ')} detected`;
      }
    }
  }
  
  // Age-based adjustments
  const childAge = child.birthDate 
    ? Math.floor((Date.now() - new Date(child.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 14;
    
  if (childAge < 13 && maxScore > 30) {
    maxScore += 10;
    reasoning += ' (Elevated due to child\'s young age)';
  }
  
  return {
    decisionId: `vettly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    severityScore: Math.min(maxScore, 100),
    categories: detectedCategories,
    confidence: maxScore / 100,
    reasoning
  };
}

export function calculateSafetyScore(
  recentMessages: Message[],
  recentAlerts: { severity: string; createdAt: Date }[]
): number {
  let score = 100;
  
  // Deduct for flagged messages
  const flaggedCount = recentMessages.filter(m => m.moderationStatus === 'flagged').length;
  score -= flaggedCount * 2;
  
  // Deduct for alerts
  for (const alert of recentAlerts) {
    switch (alert.severity) {
      case 'critical': score -= 15; break;
      case 'high': score -= 10; break;
      case 'medium': score -= 5; break;
      case 'low': score -= 2; break;
    }
  }
  
  // Ensure score stays within 0-100
  return Math.max(0, Math.min(100, score));
}
