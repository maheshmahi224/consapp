import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Clock, BookOpen, Github, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/entries/analytics/me');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prepare mood distribution data
  const moodData = Object.entries(analytics?.moodDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare tag distribution data
  const tagData = Object.entries(analytics?.tagDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare platform usage data
  const platformData = [
    { name: 'GitHub', value: analytics?.platformUsage?.github || 0 },
    { name: 'LeetCode', value: analytics?.platformUsage?.leetcode || 0 },
    { name: 'HackerRank', value: analytics?.platformUsage?.hackerrank || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Entries"
          value={analytics?.totalEntries || 0}
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          title="Total Hours"
          value={analytics?.totalHours || 0}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="GitHub Repos"
          value={analytics?.platformUsage?.github || 0}
          icon={Github}
          color="purple"
        />
        <StatCard
          title="Avg. Hours/Entry"
          value={
            analytics?.totalEntries > 0
              ? (analytics.totalHours / analytics.totalEntries).toFixed(1)
              : 0
          }
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Last 7 Days Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Last 7 Days Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics?.last7Days || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Hours"
            />
            <Line
              type="monotone"
              dataKey="entries"
              stroke="#10b981"
              strokeWidth={2}
              name="Entries"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Usage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        {moodData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Mood Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tag Distribution */}
        {tagData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Topics Covered
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tagData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">💡 Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Most Used Platform</p>
            <p className="text-2xl font-bold">
              {platformData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Most Common Mood</p>
            <p className="text-2xl font-bold">
              {moodData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-90">Top Topic</p>
            <p className="text-2xl font-bold">
              {tagData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
