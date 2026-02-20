'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Bell,
  ShieldAlert,
  Activity,
  ArrowRight,
  Plus,
  Smartphone,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import AlertCard from '@/components/AlertCard';
import { useAuthStore } from '@/store/auth';
import { dashboardApi, alertsApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, activitiesRes, statsRes] = await Promise.all([
        dashboardApi.summary(),
        dashboardApi.activities(),
        dashboardApi.stats(7),
      ]);

      setSummary(summaryRes.data.data);
      setActivities(activitiesRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await alertsApi.acknowledge(alertId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard</p>
          <a href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Go to Login →
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of your family's safety
            </p>
          </div>
          <Link href="/children/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Children"
            value={summary?.totalChildren || 0}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Active Alerts"
            value={summary?.activeAlerts || 0}
            description={summary?.criticalAlerts > 0 ? `${summary.criticalAlerts} critical` : 'All clear'}
            icon={<Bell className="h-6 w-6" />}
            color={summary?.criticalAlerts > 0 ? 'red' : 'green'}
          />
          <StatsCard
            title="Avg Safety Score"
            value={`${summary?.averageSafetyScore || 100}%`}
            trend={summary?.averageSafetyScore > 80 ? 'up' : 'neutral'}
            icon={<ShieldAlert className="h-6 w-6" />}
            color="purple"
          />
          <StatsCard
            title="Alert Resolution"
            value={`${stats?.resolutionRate || 0}%`}
            trend="neutral"
            icon={<Activity className="h-6 w-6" />}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <Link
                href="/alerts"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
              >
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {summary?.recentAlerts?.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No alerts</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your children are safe. No concerning activity detected recently.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {summary?.recentAlerts?.map((alert: any) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Children Status */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Children</h2>
            
            {activities.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-500">No children added yet</p>
                <Link
                  href="/children/new"
                  className="btn-primary mt-4 inline-flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first child
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((child) => (
                  <div key={child.childId} className="card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {child.childName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{child.childName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {child.deviceStatus === 'online' ? (
                              <>
                                <Wifi className="h-3 w-3 text-green-500" />
                                <span>Online</span>
                              </>
                            ) : (
                              <>
                                <WifiOff className="h-3 w-3 text-gray-400" />
                                <span>Last seen {formatRelativeTime(child.lastSeen)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          child.safetyScore >= 80 ? 'bg-green-100 text-green-800' :
                          child.safetyScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {child.safetyScore}%
                        </div>
                        {child.alertCount > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            {child.alertCount} alert{child.alertCount !== 1 && 's'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <Smartphone className="h-4 w-4 inline mr-1" />
                        {child.messageCount} messages
                      </span>
                      <Link
                        href={`/children/${child.childId}`}
                        className="text-primary-600 hover:text-primary-500 font-medium"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
