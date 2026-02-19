'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
  Edit,
  QrCode,
} from 'lucide-react';
import Layout from '@/components/Layout';
import AlertCard from '@/components/AlertCard';
import { useAuthStore } from '@/store/auth';
import { childrenApi, alertsApi } from '@/lib/api';
import { formatDateTime, formatRelativeTime, cn } from '@/lib/utils';

export default function ChildDetailPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && childId) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router, childId]);

  const loadData = async () => {
    try {
      const [childRes, activityRes, alertsRes] = await Promise.all([
        childrenApi.get(childId),
        childrenApi.activity(childId),
        alertsApi.list({ childId, pageSize: 5 }),
      ]);

      setChild(childRes.data.data);
      setActivity(activityRes.data.data);
      setAlerts(alertsRes.data.data.items);
    } catch (error) {
      console.error('Failed to load child data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await alertsApi.acknowledge(alertId);
      loadData();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await alertsApi.resolve(alertId);
      loadData();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated || !child) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/children"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Children
        </Link>

        {/* Child Header */}
        <div className="card">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-700">
                    {child.displayName[0]}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{child.displayName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {child.isActive ? (
                        <><Wifi className="h-3 w-3" /> Active</>
                      ) : (
                        <><WifiOff className="h-3 w-3" /> Inactive</>
                      )}
                    </span>
                    {child.deviceType && (
                      <span className="text-xs text-gray-500 capitalize flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        {child.deviceType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn-secondary text-sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Pair Device
                </button>
                <Link
                  href={`/children/${childId}/edit`}
                  className="btn-secondary text-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{child.safetyScore}%</p>
                <p className="text-sm text-gray-500">Safety Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {activity?.messages?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {activity?.alerts?.filter((a: any) => a.status !== 'resolved').length || 0}
                </p>
                <p className="text-sm text-gray-500">Active Alerts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {child.birthDate 
                    ? Math.floor((Date.now() - new Date(child.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : '-'
                  }
                </p>
                <p className="text-sm text-gray-500">Years Old</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </h2>
              <Link
                href={`/alerts?childId=${childId}`}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>

            {alerts.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-500">No alerts for this child</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.slice(0, 3).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    onResolve={handleResolve}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </h2>
            </div>

            {activity?.messages?.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-500">No messages recorded yet</p>
              </div>
            ) : (
              <div className="card divide-y">
                {activity?.messages?.slice(0, 5).map((message: any) => (
                  <div key={message.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {message.senderName || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-400">
                            via {message.sourceApp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {message.content || '[Media]'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatRelativeTime(message.receivedAt)}
                      </span>
                    </div>
                    {message.moderationStatus !== 'safe' && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          message.moderationStatus === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.moderationStatus}
                        </span>
                        {message.severityScore && (
                          <span className="text-xs text-gray-500">
                            Score: {message.severityScore}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Device Sessions */}
        {activity?.sessions?.length > 0 && (
          <div className="card">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sessions
              </h2>
            </div>
            <div className="divide-y">
              {activity.sessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.locationLat && session.locationLng
                          ? `${session.locationLat.toFixed(4)}, ${session.locationLng.toFixed(4)}`
                          : 'Location unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(session.startedAt)}
                      </p>
                    </div>
                  </div>
                  {session.endedAt ? (
                    <span className="text-xs text-gray-500">
                      Duration: {Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)}m
                    </span>
                  ) : (
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
