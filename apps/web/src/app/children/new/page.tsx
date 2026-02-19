'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Smartphone } from 'lucide-react';
import Layout from '@/components/Layout';
import { childrenApi } from '@/lib/api';

export default function NewChildPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    birthDate: '',
    deviceType: 'android' as 'ios' | 'android',
    deviceId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await childrenApi.create({
        displayName: formData.displayName,
        birthDate: formData.birthDate || undefined,
        deviceType: formData.deviceType,
        deviceId: formData.deviceId || undefined,
      });

      router.push('/children');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add child. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/children"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Children
          </Link>
        </div>

        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add a Child</h1>
                <p className="text-sm text-gray-500">
                  Set up monitoring for a new child device
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Child's Name *
              </label>
              <input
                type="text"
                id="displayName"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="input mt-1"
                placeholder="e.g., Emma"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Birth Date (optional)
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="input mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used to provide age-appropriate safety analysis
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deviceType: 'android' })}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    formData.deviceType === 'android'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Android</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deviceType: 'ios' })}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    formData.deviceType === 'ios'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">iOS</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700">
                Device ID (optional)
              </label>
              <input
                type="text"
                id="deviceId"
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                className="input mt-1"
                placeholder="Auto-generated after device setup"
              />
            </div>

            <div className="pt-4 border-t flex items-center justify-end gap-3">
              <Link
                href="/children"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Child'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="font-medium text-gray-900 mb-2">Next Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Add your child above to create their profile</li>
            <li>Download the SafeGuard Companion app on their device</li>
            <li>Scan the QR code from their profile to pair the device</li>
            <li>Monitoring will begin automatically</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}
