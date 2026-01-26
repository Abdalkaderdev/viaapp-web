'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { api } from '@/lib/api';
import type { ReadingPlan } from '@shared/types';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Loader2,
  Sprout,
  Leaf,
  TreePine,
} from 'lucide-react';

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    description: 'Seed & Seedling',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Sapling & Growing',
    icon: Leaf,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  advanced: {
    label: 'Advanced',
    description: 'Firmly Planted',
    icon: TreePine,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
};

export default function ReadingPlansPage() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DifficultyFilter>('all');

  useEffect(() => {
    async function fetchPlans() {
      const result = await api.readingPlans.getPlans();
      if (result.data) {
        setPlans(result.data);
      }
      setLoading(false);
    }
    fetchPlans();
  }, []);

  const filteredPlans = filter === 'all'
    ? plans
    : plans.filter(p => p.difficulty === filter);

  const groupedPlans = {
    beginner: filteredPlans.filter(p => p.difficulty === 'beginner'),
    intermediate: filteredPlans.filter(p => p.difficulty === 'intermediate'),
    advanced: filteredPlans.filter(p => p.difficulty === 'advanced'),
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/quiet-time"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to QT Experiences
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bible Reading Plans</h1>
          <p className="text-gray-600 mt-1">
            Choose from {plans.length} reading plans covering the entire Bible
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Plans ({plans.length})
          </button>
          {(Object.keys(difficultyConfig) as (keyof typeof difficultyConfig)[]).map((key) => {
            const config = difficultyConfig[key];
            const count = plans.filter(p => p.difficulty === key).length;
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  filter === key
                    ? `${config.bgColor} ${config.color} ${config.borderColor} border`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Plans Grid */}
        {filter === 'all' ? (
          // Show grouped by difficulty
          <div className="space-y-8">
            {(Object.keys(difficultyConfig) as (keyof typeof difficultyConfig)[]).map((key) => {
              const config = difficultyConfig[key];
              const planGroup = groupedPlans[key];
              if (planGroup.length === 0) return null;
              const Icon = config.icon;

              return (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
                      <p className="text-sm text-gray-500">{config.description} • {planGroup.length} plans</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planGroup.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show filtered plans
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reading plans found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PlanCard({ plan }: { plan: ReadingPlan }) {
  const config = difficultyConfig[plan.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center ${config.color} flex-shrink-0`}>
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">
            {plan.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {plan.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              {plan.durationDays} days
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex-shrink-0">
          Start
        </button>
      </div>
    </div>
  );
}
