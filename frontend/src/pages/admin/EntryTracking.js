import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Calendar,
  Building2,
  Users,
  FileText,
  Github,
  Code,
  ExternalLink,
  Download,
  Search,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import api from '../../utils/api';

const EntryTracking = () => {
  const [collegeStats, setCollegeStats] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('');

  useEffect(() => {
    fetchCollegeStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (selectedCollege) {
      fetchEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollege, selectedDate]);

  const fetchCollegeStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/college-stats', {
        params: { date: selectedDate }
      });
      setCollegeStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch college statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/entries', {
        params: {
          college: selectedCollege,
          date: selectedDate
        }
      });
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    } else {
      toast.info('Link not provided');
    }
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    setSearchTerm('');
    setFilterMood('');
  };

  const handleBack = () => {
    setSelectedCollege('');
    setEntries([]);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userId?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = !filterMood || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  if (loading && collegeStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary-600" />
              Entry Tracking Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor student daily learning entries across all colleges
            </p>
          </div>
          
          {/* Date Picker */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedCollege ? (
        /* College Cards View */
        <div>
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6 border border-primary-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Select College to View Entries
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Click on a college card below to view student entries for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </div>

          {collegeStats.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No entries found for this date
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try selecting a different date
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collegeStats.map((stat, index) => (
                <div
                  key={index}
                  onClick={() => handleCollegeSelect(stat.college)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-400 overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6">
                    <Building2 className="h-12 w-12 text-white mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white truncate">
                      {stat.college}
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {stat.studentCount}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Entries</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {stat.entryCount}
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      View Details
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Entries Table View - Excel Style */
        <div>
          {/* Header with Back Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  ← Back to Colleges
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary-600" />
                    {selectedCollege}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredEntries.length} entries found for {new Date(selectedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => toast.info('Export feature coming soon!')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Moods</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Excel-Style Table */}
          {filteredEntries.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500 dark:text-gray-400">No entries found</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Table Header - Excel Style */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-300 dark:border-gray-600">
                <div className="grid grid-cols-12 gap-4 p-4 font-bold text-sm text-gray-700 dark:text-gray-300">
                  <div className="col-span-2">Student Info</div>
                  <div className="col-span-1 text-center">Time</div>
                  <div className="col-span-2">Concepts</div>
                  <div className="col-span-2">Problems</div>
                  <div className="col-span-1 text-center">Mood</div>
                  <div className="col-span-1 text-center">Type</div>
                  <div className="col-span-2 text-center">Platform Links</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEntries.map((entry, index) => (
                  <div
                    key={entry._id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors items-start"
                  >
                    {/* Student Info */}
                    <div className="col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {entry.userId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {entry.userId?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {entry.userId?.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {entry.userId?.year}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time Duration */}
                    <div className="col-span-1 text-center">
                      <div className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {entry.timeDuration?.hours}h {entry.timeDuration?.minutes}m
                        </span>
                      </div>
                    </div>

                    {/* Concepts */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.concepts || <span className="text-gray-400 italic">No concepts</span>}
                      </p>
                      {entry.tag && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {entry.tag}
                        </span>
                      )}
                    </div>

                    {/* Problems */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.problemsPracticed || <span className="text-gray-400 italic">No problems</span>}
                      </p>
                    </div>

                    {/* Mood */}
                    <div className="col-span-1 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        entry.mood === 'Excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        entry.mood === 'Good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        entry.mood === 'Average' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {entry.mood}
                      </span>
                    </div>

                    {/* Learning Type */}
                    <div className="col-span-1 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {entry.learningType?.replace('-', ' ')}
                      </p>
                    </div>

                    {/* Platform Links */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {entry.githubRepo && (
                          <button
                            onClick={() => openLink(entry.githubRepo)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-xs rounded-lg transition-colors"
                            title="View GitHub"
                          >
                            <Github className="h-3 w-3" />
                            GitHub
                          </button>
                        )}
                        {entry.leetcodeLink && (
                          <button
                            onClick={() => openLink(entry.leetcodeLink)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition-colors"
                            title="View LeetCode"
                          >
                            <Code className="h-3 w-3" />
                            LeetCode
                          </button>
                        )}
                        {entry.hackerrankLink && (
                          <button
                            onClick={() => openLink(entry.hackerrankLink)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                            title="View HackerRank"
                          >
                            <Code className="h-3 w-3" />
                            HackerRank
                          </button>
                        )}
                        {!entry.githubRepo && !entry.leetcodeLink && !entry.hackerrankLink && (
                          <span className="text-xs text-gray-400 italic">No links</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      <div className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntryTracking;
