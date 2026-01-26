'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { PrayerRequest } from '@viaapp/shared';
import { PRAYER_CATEGORIES } from '@viaapp/shared';
import {
  Heart,
  Plus,
  Check,
  Clock,
  Archive,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function PrayerPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    description: '',
    category: 'personal',
    visibility: 'private',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, [filter]);

  async function fetchPrayers() {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    const result = await api.prayer.getRequests(params);
    if (result.data) {
      setPrayers(result.data.data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const result = await api.prayer.createRequest(newPrayer);
    if (result.data) {
      setPrayers([result.data, ...prayers]);
      setShowNewForm(false);
      setNewPrayer({ title: '', description: '', category: 'personal', visibility: 'private' });
    }

    setSubmitting(false);
  }

  async function markAnswered(id: string) {
    const result = await api.prayer.markAnswered(id);
    if (result.data) {
      setPrayers(prayers.map(p => p.id === id ? result.data! : p));
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prayer Journal</h1>
            <p className="text-gray-600 mt-1">
              Track your prayers and celebrate answered ones
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            New Prayer
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'answered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                filter === f
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Answered'}
            </button>
          ))}
        </div>

        {/* New Prayer Form */}
        {showNewForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Prayer Request</h3>
              <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPrayer.title}
                  onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  placeholder="What would you like to pray for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={newPrayer.description}
                  onChange={(e) => setNewPrayer({ ...newPrayer, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                  placeholder="Add more details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newPrayer.category}
                    onChange={(e) => setNewPrayer({ ...newPrayer, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  >
                    {PRAYER_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select
                    value={newPrayer.visibility}
                    onChange={(e) => setNewPrayer({ ...newPrayer, visibility: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  >
                    <option value="private">Private</option>
                    <option value="partner">Partner only</option>
                    <option value="church">Church</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Prayer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Prayer List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          </div>
        ) : prayers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prayer requests yet</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-4 text-brand-600 font-medium hover:text-brand-700"
            >
              Add your first prayer →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className={clsx(
                  'bg-white rounded-2xl p-6 border transition-all',
                  prayer.status === 'answered'
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-gray-200'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
                      {prayer.status === 'answered' && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          Answered
                        </span>
                      )}
                    </div>
                    {prayer.description && (
                      <p className="text-gray-600 mt-1">{prayer.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="capitalize">{prayer.category}</span>
                      <span>•</span>
                      <span>{new Date(prayer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {prayer.status === 'active' && (
                    <button
                      onClick={() => markAnswered(prayer.id)}
                      className="text-gray-400 hover:text-green-600 p-2"
                      title="Mark as answered"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
