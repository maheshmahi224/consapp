import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, BookOpen } from 'lucide-react';
import api from '../../utils/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/leaderboard?timeframe=${timeframe}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank) => {
    const badges = {
      0: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      1: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      2: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
    };
    return badges[rank] || 'bg-primary-600 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard 🏆</h1>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="relative">
              <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-gray-700">
                  {leaderboard[1]?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-2 -right-2">
                {getRankIcon(1)}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mt-2">{leaderboard[1]?.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{leaderboard[1]?.college}</p>
            <div className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {leaderboard[1]?.totalHours}h
              </p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {leaderboard[0]?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-4 -right-4">
                {getRankIcon(0)}
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-2">
              {leaderboard[0]?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{leaderboard[0]?.college}</p>
            <div className="mt-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
              <p className="text-3xl font-bold text-white">{leaderboard[0]?.totalHours}h</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="relative">
              <div className="h-20 w-20 bg-orange-400 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-white">
                  {leaderboard[2]?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -top-2 -right-2">
                {getRankIcon(2)}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mt-2">{leaderboard[2]?.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{leaderboard[2]?.college}</p>
            <div className="mt-2 px-4 py-2 bg-orange-200 dark:bg-orange-900 rounded-lg">
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {leaderboard[2]?.totalHours}h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Entries
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No data available
                  </td>
                </tr>
              ) : (
                leaderboard.map((student, index) => (
                  <tr
                    key={student._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      index < 3 ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {index < 3 && getRankIcon(index)}
                        <span
                          className={`px-3 py-1 text-sm font-bold rounded-full ${getRankBadge(index)}`}
                        >
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {student.college}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary-600" />
                        <span className="text-lg font-bold text-primary-600">
                          {student.totalHours}h
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {student.entryCount}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
