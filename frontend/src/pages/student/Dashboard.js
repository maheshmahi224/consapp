import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Flame, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  // Prepare chart data
  const chartData = stats?.weeklyData?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: entry.timeDuration?.hours || 0,
  })) || [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="mt-2 text-sm sm:text-base text-primary-100">
          Let's track your learning journey and stay consistent!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Hours This Week"
          value={stats?.totalHoursThisWeek || 0}
          icon={Clock}
          color="blue"
          subtitle="Keep it up!"
        />
        <StatCard
          title="Entries Today"
          value={stats?.entriesCount || 0}
          icon={BookOpen}
          color="green"
          subtitle="Daily progress"
        />
        <StatCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          icon={Flame}
          color="orange"
          subtitle="Don't break it!"
        />
        <StatCard
          title="Total Entries"
          value={stats?.weeklyData?.length || 0}
          icon={TrendingUp}
          color="purple"
          subtitle="This week"
        />
      </div>

      {/* Weekly Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Weekly Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: '#0ea5e9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/student/entries"
            className="p-4 border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors text-center"
          >
            <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Add Entry</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Log your daily progress</p>
          </a>
          <a
            href="/student/analytics"
            className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-600 dark:hover:border-green-400 transition-colors text-center"
          >
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">View Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check your insights</p>
          </a>
          <a
            href="/student/profile"
            className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-600 dark:hover:border-purple-400 transition-colors text-center"
          >
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Update Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your info</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
