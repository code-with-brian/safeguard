'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { formatRelativeTime, getSeverityColor, getStatusColor, getCategoryLabel } from '@/lib/utils';

interface Alert {
  id: string;
  childId: string;
  childName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description?: string;
  createdAt: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'false_positive';
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

export default function AlertCard({ alert, onAcknowledge, onResolve, compact = false }: AlertCardProps) {
  const severityIcon = {
    critical: <AlertTriangle className="h-5 w-5 text-danger-600" />,
    high: <AlertTriangle className="h-5 w-5 text-warning-600" />,
    medium: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    low: <MessageSquare className="h-5 w-5 text-gray-500" />,
  };

  if (compact) {
    return (
      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{severityIcon[alert.severity]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`badge-${alert.severity}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(alert.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900 truncate">
              {alert.title}
            </p>
            <p className="text-xs text-gray-500">{alert.childName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
            {severityIcon[alert.severity]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge-${alert.severity}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className={`badge-${alert.status}`}>
                {alert.status.replace('_', ' ')}
              </span>
              <span className="badge bg-gray-100 text-gray-700">
                {getCategoryLabel(alert.category)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {alert.childName} • {formatRelativeTime(alert.createdAt)}
            </p>
            {alert.description && (
              <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
            )}
          </div>
        </div>
      </div>

      {alert.status === 'new' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAcknowledge?.(alert.id)}
            className="btn-secondary text-sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Acknowledge
          </button>
          <button
            onClick={() => onResolve?.(alert.id)}
            className="btn-primary text-sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolve
          </button>
          <Link
            href={`/alerts/${alert.id}`}
            className="btn-secondary text-sm ml-auto"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}
