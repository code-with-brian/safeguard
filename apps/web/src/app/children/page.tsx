'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Smartphone,
  MoreVertical,
  Edit,
  Trash2,
  Activity,
  ChevronRight,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/auth';
import { childrenApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Child {
  id: string;
  displayName: string;
  birthDate: string | null;
  deviceType: string | null;
  deviceId: string | null;
  isActive: boolean;
  safetyScore: number;
  alertThreshold: string;
  createdAt: string;
}

export default function ChildrenPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadChildren();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadChildren = async () => {
    try {
      const response = await childrenApi.list();
      setChildren(response.data.data);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this child?')) return;

    try {
      await childrenApi.delete(id);
      loadChildren();
    } catch (error) {
      console.error('Failed to delete child:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Children</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your children's devices and monitoring settings
            </p>
          </div>
          <Link href="/children/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Link>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-900">No children added yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Add your first child to start monitoring their online activity and keep them safe.
            </p>
            <Link
              href="/children/new"
              className="btn-primary mt-6 inline-flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first child
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div key={child.id} className="card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary-700">
                          {child.displayName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {child.displayName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {child.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {child.deviceType && (
                            <span className="text-xs text-gray-500 capitalize">
                              {child.deviceType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === child.id ? null : child.id)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                      {showMenu === child.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                          <Link
                            href={`/children/${child.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowMenu(null)}
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            View Activity
                          </Link>
                          <Link
                            href={`/children/${child.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowMenu(null)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              handleDelete(child.id);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Safety Score</span>
                      <span className={`font-medium ${
                        child.safetyScore >= 80 ? 'text-green-600' :
                        child.safetyScore >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {child.safetyScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          child.safetyScore >= 80 ? 'bg-green-500' :
                          child.safetyScore >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${child.safetyScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Alert Threshold</span>
                      <span className="capitalize">{child.alertThreshold}</span>
                    </div>
                    {child.birthDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Birth Date</span>
                        <span>{formatDate(child.birthDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Added</span>
                      <span>{formatDate(child.createdAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/children/${child.id}`}
                    className="mt-6 flex items-center justify-center w-full py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                  >
                    View Activity
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
