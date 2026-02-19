import { prisma } from '@safeguard/database';
import type { DashboardSummary, ChildActivity, SafetyScore } from '@safeguard/shared';

export async function getDashboardSummary(familyId: string): Promise<DashboardSummary> {
  const children = await prisma.child.findMany({
    where: { familyId, isActive: true }
  });
  
  const activeAlerts = await prisma.alert.count({
    where: {
      familyId,
      status: { in: ['new', 'acknowledged'] }
    }
  });
  
  const criticalAlerts = await prisma.alert.count({
    where: {
      familyId,
      severity: 'critical',
      status: { in: ['new', 'acknowledged'] }
    }
  });
  
  const averageSafetyScore = children.length > 0
    ? Math.round(children.reduce((sum, c) => sum + c.safetyScore, 0) / children.length)
    : 100;
  
  const recentAlerts = await prisma.alert.findMany({
    where: { familyId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { child: true }
  });
  
  return {
    totalChildren: children.length,
    activeAlerts,
    criticalAlerts,
    averageSafetyScore,
    recentAlerts: recentAlerts.map(a => ({
      id: a.id,
      childId: a.childId,
      childName: a.child.displayName,
      severity: a.severity as any,
      category: a.category,
      title: a.title,
      createdAt: a.createdAt,
      status: a.status as any
    }))
  };
}

export async function getChildActivities(familyId: string): Promise<ChildActivity[]> {
  const children = await prisma.child.findMany({
    where: { familyId, isActive: true }
  });
  
  const activities: ChildActivity[] = [];
  
  for (const child of children) {
    const lastSession = await prisma.deviceSession.findFirst({
      where: { childId: child.id },
      orderBy: { startedAt: 'desc' }
    });
    
    const messageCount = await prisma.message.count({
      where: { childId: child.id }
    });
    
    const alertCount = await prisma.alert.count({
      where: { childId: child.id, status: { in: ['new', 'acknowledged'] } }
    });
    
    // Determine device status (online if session started within last 5 minutes and not ended)
    const isOnline = lastSession 
      ? !lastSession.endedAt && (Date.now() - lastSession.startedAt.getTime()) < 5 * 60 * 1000
      : false;
    
    activities.push({
      childId: child.id,
      childName: child.displayName,
      deviceStatus: isOnline ? 'online' : 'offline',
      lastSeen: lastSession?.startedAt || child.createdAt,
      messageCount,
      alertCount,
      safetyScore: child.safetyScore
    });
  }
  
  return activities;
}

export async function getSafetyScores(familyId: string): Promise<{ childId: string; childName: string; scores: SafetyScore }[]> {
  const children = await prisma.child.findMany({
    where: { familyId, isActive: true }
  });
  
  const results = [];
  
  for (const child of children) {
    // Get recent wellbeing snapshot
    const snapshot = await prisma.wellbeingSnapshot.findFirst({
      where: { childId: child.id },
      orderBy: { snapshotDate: 'desc' }
    });
    
    // Calculate trend based on past snapshots
    const pastSnapshots = await prisma.wellbeingSnapshot.findMany({
      where: { childId: child.id },
      orderBy: { snapshotDate: 'desc' },
      take: 7
    });
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (pastSnapshots.length >= 2) {
      const recent = pastSnapshots[0]?.overallScore || 0;
      const older = pastSnapshots[pastSnapshots.length - 1]?.overallScore || 0;
      if (recent > older + 5) trend = 'up';
      else if (recent < older - 5) trend = 'down';
    }
    
    results.push({
      childId: child.id,
      childName: child.displayName,
      scores: {
        overall: child.safetyScore,
        mood: snapshot?.moodScore || 75,
        social: snapshot?.socialScore || 75,
        sleep: snapshot?.sleepScore || 75,
        trend
      }
    });
  }
  
  return results;
}
