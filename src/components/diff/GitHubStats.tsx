'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  EyeIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Card, CardContent } from '@/components/ui/card';
import { fetchGitHubStats } from '@/services/githubAPI';

interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  lastUpdated: string;
}

const GitHubStats: React.FC<{ className?: string }> = ({ className }) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchGitHubStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load GitHub stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Loading GitHub stats...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400">
            <ExclamationCircleIcon className="w-5 h-5" />
            <span className="text-sm">Unable to load GitHub stats</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: <StarIcon className="w-5 h-5" />,
      label: 'Stars',
      value: stats.stars,
      color: 'text-yellow-500',
    },
    {
      icon: <PlusIcon className="w-5 h-5" />,
      label: 'Forks',
      value: stats.forks,
      color: 'text-green-500',
    },
    {
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      label: 'Issues',
      value: stats.issues,
      color: 'text-red-500',
    },
    {
      icon: <EyeIcon className="w-5 h-5" />,
      label: 'Watchers',
      value: stats.watchers,
      color: 'text-blue-500',
    },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`flex items-center justify-center mb-2 ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubStats;