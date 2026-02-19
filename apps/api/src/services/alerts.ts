import { prisma, type Message, type Child, type Alert } from '@safeguard/database';
import type { ModerationResult } from '@safeguard/shared';

export async function createAlertFromMessage(
  message: Message,
  child: Child,
  moderationResult: ModerationResult
): Promise<Alert | null> {
  if (moderationResult.severityScore < 40) {
    return null;
  }
  
  // Determine severity based on score
  let severity: 'critical' | 'high' | 'medium' | 'low';
  if (moderationResult.severityScore >= 80) severity = 'critical';
  else if (moderationResult.severityScore >= 60) severity = 'high';
  else if (moderationResult.severityScore >= 40) severity = 'medium';
  else severity = 'low';
  
  const category = moderationResult.categories[0] || 'inappropriate_language';
  
  // Get conversation context
  const contextMessages = await prisma.message.findMany({
    where: { conversationId: message.conversationId },
    orderBy: { receivedAt: 'desc' },
    take: 5
  });
  
  // Generate title and description
  const { title, description, suggestedAction } = generateAlertContent(
    category,
    severity,
    message,
    child
  );
  
  const alert = await prisma.alert.create({
    data: {
      familyId: child.familyId,
      childId: child.id,
      severity,
      category,
      title,
      description,
      contextMessages: JSON.stringify(contextMessages.map(m => ({
        content: m.content?.substring(0, 200),
        senderName: m.senderName,
        sentAt: m.sentAt
      }))),
      suggestedAction,
      aiReasoning: moderationResult.reasoning,
      status: 'new'
    }
  });
  
  // Update message to link to alert
  await prisma.message.update({
    where: { id: message.id },
    data: { 
      isAlertGenerated: true,
      alertId: alert.id
    }
  });
  
  // Send notifications
  await sendAlertNotifications(alert, child);
  
  return alert;
}

function generateAlertContent(
  category: string,
  severity: string,
  message: Message,
  child: Child
): { title: string; description: string; suggestedAction: string } {
  const senderInfo = message.senderName || 'Unknown';
  const appName = message.sourceApp || 'messaging app';
  
  const templates: Record<string, { title: string; description: string; action: string }> = {
    suicidal_ideation: {
      title: `Possible suicidal ideation from ${child.displayName}`,
      description: `Detected concerning language that may indicate suicidal thoughts in ${appName} conversation with ${senderInfo}.`,
      action: 'Have a calm, non-judgmental conversation. Ask directly: "Are you thinking about hurting yourself?" If yes, stay with them and contact crisis resources.'
    },
    self_harm: {
      title: `Self-harm indicators from ${child.displayName}`,
      description: `Message content suggests potential self-harm behavior in conversation with ${senderInfo} on ${appName}.`,
      action: 'Approach with empathy. Express concern without judgment. Consider involving a mental health professional.'
    },
    grooming: {
      title: `Potential grooming behavior detected`,
      description: `${child.displayName} received concerning messages from ${senderInfo} on ${appName} that may indicate grooming behavior.`,
      action: 'Review the conversation together. Ask open questions about how they know this person. Consider blocking the contact and reporting to authorities if appropriate.'
    },
    cyberbullying: {
      title: `Cyberbullying detected involving ${child.displayName}`,
      description: `Detected hurtful or threatening messages in ${appName} conversation with ${senderInfo}.`,
      action: 'Listen to their experience. Document the messages. Contact school if involved. Consider reporting to the platform.'
    },
    sexual_content: {
      title: `Inappropriate sexual content`,
      description: `${child.displayName} received or sent sexual content on ${appName}.`,
      action: 'Have an age-appropriate conversation about online safety and digital permanence. Review privacy settings.'
    },
    violence: {
      title: `Violence or threats detected`,
      description: `Detected violent language or threats in ${appName} conversation with ${senderInfo}.`,
      action: 'Assess immediate safety. Take threats seriously. Contact school or authorities if needed.'
    },
    drugs: {
      title: `Drug or alcohol references`,
      description: `${child.displayName} mentioned drugs or alcohol in conversation with ${senderInfo} on ${appName}.`,
      action: 'Use as conversation starter about substance use. Maintain open communication about peer pressure.'
    },
    hate_speech: {
      title: `Hate speech detected`,
      description: `Detected discriminatory or hateful language from ${child.displayName} or directed at them on ${appName}.`,
      action: 'Discuss respect and inclusion. Address underlying issues. Set clear expectations about language.'
    },
    inappropriate_language: {
      title: `Inappropriate language`,
      description: `${child.displayName} used or received inappropriate language on ${appName}.`,
      action: 'Address based on context and your family values. Use as teaching moment about appropriate communication.'
    }
  };
  
  const template = templates[category] || templates.inappropriate_language;
  
  return {
    title: template.title,
    description: template.description,
    suggestedAction: template.action
  };
}

async function sendAlertNotifications(alert: Alert, child: Child): Promise<void> {
  // In production, this would send push notifications via Firebase FCM
  // and SMS via Twilio for critical alerts
  
  console.log(`[ALERT NOTIFICATION] ${alert.severity.toUpperCase()}: ${alert.title}`);
  console.log(`  Family: ${child.familyId}`);
  console.log(`  Child: ${child.displayName}`);
  console.log(`  Action: ${alert.suggestedAction}`);
  
  // TODO: Integrate with Firebase FCM for push notifications
  // TODO: Integrate with Twilio for SMS alerts (critical only)
}

export async function getAlertTrends(
  familyId: string,
  days: number = 30
): Promise<{ date: string; count: number; bySeverity: Record<string, number> }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const alerts = await prisma.alert.findMany({
    where: {
      familyId,
      createdAt: { gte: startDate }
    },
    orderBy: { createdAt: 'asc' }
  });
  
  // Group by date
  const grouped = alerts.reduce((acc, alert) => {
    const date = alert.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, count: 0, bySeverity: {} };
    }
    acc[date].count++;
    acc[date].bySeverity[alert.severity] = (acc[date].bySeverity[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, { date: string; count: number; bySeverity: Record<string, number> }>);
  
  return Object.values(grouped);
}
