'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Shield, CreditCard, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/store/auth';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadProfile = async () => {
    try {
      const response = await authApi.me();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="card overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="card">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                  <p className="text-sm text-gray-500">Manage your account information</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        defaultValue={profile?.firstName || ''}
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        defaultValue={profile?.lastName || ''}
                        className="input mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={profile?.email || ''}
                      className="input mt-1"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      className="input mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { id: 'critical', label: 'Critical Alerts', description: 'Immediate push + SMS for critical issues' },
                    { id: 'high', label: 'High Priority', description: 'Push notifications for high severity alerts' },
                    { id: 'daily', label: 'Daily Digest', description: 'Summary of medium and low priority alerts' },
                    { id: 'weekly', label: 'Weekly Report', description: 'Weekly wellbeing summary' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked
                        className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300"
                      />
                      <div>
                        <label htmlFor={item.id} className="font-medium text-gray-900">
                          {item.label}
                        </label>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <button className="btn-primary">Save Preferences</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500">Manage your password and security settings</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input type="password" className="input mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input type="password" className="input mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input type="password" className="input mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="card">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
                  <p className="text-sm text-gray-500">Manage your plan and billing</p>
                </div>
                <div className="p-6">
                  <div className="bg-primary-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-primary-600 font-medium">Current Plan</p>
                        <p className="text-2xl font-bold text-gray-900">Free</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Available Plans</h3>
                    {[
                      { name: 'Free', price: '$0', features: ['1 child', 'Basic monitoring', 'Email alerts'] },
                      { name: 'Premium', price: '$9/mo', features: ['3 children', 'Advanced AI', 'Real-time alerts', 'Wellbeing reports'] },
                      { name: 'Family', price: '$15/mo', features: ['5 children', 'All Premium features', 'Priority support', 'Video analysis'] },
                    ].map((plan) => (
                      <div
                        key={plan.name}
                        className={`border rounded-lg p-4 ${plan.name === 'Free' ? 'border-primary-500 bg-primary-50' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{plan.name}</span>
                          <span className="text-lg font-bold text-gray-900">{plan.price}</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plan.features.map((feature) => (
                            <li key={feature}>• {feature}</li>
                          ))}
                        </ul>
                        {plan.name !== 'Free' && (
                          <button className="mt-3 text-sm text-primary-600 font-medium hover:text-primary-500">
                            Upgrade →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
