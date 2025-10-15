import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Smile,
  Tag,
  Calendar,
  Clock
} from 'lucide-react';
import api from '../../utils/api';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeDuration: { hours: 0, minutes: 0 },
    concepts: '',
    githubRepo: '',
    leetcodeLink: '',
    hackerrankLink: '',
    doubts: '',
    problemsPracticed: '',
    mood: 'Good',
    learningType: 'Self-study',
    tag: '',
    screenshotUrl: '',
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/entries');
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hours' || name === 'minutes') {
      setFormData({
        ...formData,
        timeDuration: { ...formData.timeDuration, [name]: parseInt(value) || 0 }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEntry) {
        await api.put(`/entries/${editingEntry._id}`, formData);
        toast.success('Entry updated successfully!');
      } else {
        await api.post('/entries', formData);
        toast.success('Entry created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save entry');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split('T')[0],
      timeDuration: entry.timeDuration,
      concepts: entry.concepts || '',
      githubRepo: entry.githubRepo || '',
      leetcodeLink: entry.leetcodeLink || '',
      hackerrankLink: entry.hackerrankLink || '',
      doubts: entry.doubts || '',
      problemsPracticed: entry.problemsPracticed || '',
      mood: entry.mood || 'Good',
      learningType: entry.learningType || 'Self-study',
      tag: entry.tag || '',
      screenshotUrl: entry.screenshotUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/entries/${id}`);
        toast.success('Entry deleted successfully!');
        fetchEntries();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  const resetForm = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      timeDuration: { hours: 0, minutes: 0 },
      concepts: '',
      githubRepo: '',
      leetcodeLink: '',
      hackerrankLink: '',
      doubts: '',
      problemsPracticed: '',
      mood: 'Good',
      learningType: 'Self-study',
      tag: '',
      screenshotUrl: '',
    });
  };

  const getMoodColor = (mood) => {
    const colors = {
      Excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[mood] || colors.Good;
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning Entries</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Entries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Concepts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No entries yet. Start tracking your learning journey!
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.timeDuration.hours}h {entry.timeDuration.minutes}m
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs truncate">{entry.concepts || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMoodColor(entry.mood)}`}>
                        {entry.mood}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.tag || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingEntry ? 'Edit Entry' : 'Add New Entry'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Time Duration
                    </label>
                    <div className="flex space-x-3">
                      {/* Hours Input */}
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
                          Hours
                        </label>
                        <div className="relative">
                          <input
                            name="hours"
                            type="number"
                            min="0"
                            value={formData.timeDuration.hours}
                            onChange={handleChange}
                            placeholder="0"
                            className="block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold text-lg"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">hrs</span>
                          </div>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="flex items-end pb-2">
                        <span className="text-2xl font-bold text-gray-400">:</span>
                      </div>

                      {/* Minutes Input */}
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
                          Minutes
                        </label>
                        <div className="relative">
                          <input
                            name="minutes"
                            type="number"
                            min="0"
                            max="59"
                            value={formData.timeDuration.minutes}
                            onChange={handleChange}
                            placeholder="0"
                            className="block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold text-lg"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mood/Focus Level
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Smile className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="mood"
                        value={formData.mood}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Learning Type
                    </label>
                    <select
                      name="learningType"
                      value={formData.learningType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Self-study">Self-study</option>
                      <option value="Peer-learning">Peer-learning</option>
                      <option value="Mentor-guided">Mentor-guided</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tag/Topic
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="tag"
                        type="text"
                        value={formData.tag}
                        onChange={handleChange}
                        placeholder="e.g., DSA, Web Dev, AI, DBMS"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Concepts Learned
                  </label>
                  <textarea
                    name="concepts"
                    rows="3"
                    value={formData.concepts}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Problems Practiced
                  </label>
                  <textarea
                    name="problemsPracticed"
                    rows="2"
                    value={formData.problemsPracticed}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doubts Faced
                  </label>
                  <textarea
                    name="doubts"
                    rows="2"
                    value={formData.doubts}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub Repo Link
                    </label>
                    <input
                      name="githubRepo"
                      type="text"
                      value={formData.githubRepo}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LeetCode Link
                    </label>
                    <input
                      name="leetcodeLink"
                      type="text"
                      value={formData.leetcodeLink}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      HackerRank Link
                    </label>
                    <input
                      name="hackerrankLink"
                      type="text"
                      value={formData.hackerrankLink}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Screenshot URL (Optional)
                  </label>
                  <input
                    name="screenshotUrl"
                    type="text"
                    value={formData.screenshotUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingEntry ? 'Update Entry' : 'Add Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entries;
