import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Building2, CheckCircle, XCircle, KeyRound } from 'lucide-react';
import api from '../../utils/api';

const Settings = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [collegeName, setCollegeName] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response.data);
    } catch (error) {
      toast.error('Failed to fetch colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!collegeName.trim()) {
      toast.error('College name is required');
      return;
    }

    try {
      if (editingCollege) {
        await api.put(`/colleges/${editingCollege._id}`, { name: collegeName });
        toast.success('College updated successfully');
      } else {
        await api.post('/colleges', { name: collegeName });
        toast.success('College added successfully');
      }

      setShowModal(false);
      setCollegeName('');
      setEditingCollege(null);
      fetchColleges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save college');
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setCollegeName(college.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await api.delete(`/colleges/${id}`);
        toast.success('College deleted successfully');
        fetchColleges();
      } catch (error) {
        toast.error('Failed to delete college');
      }
    }
  };

  const toggleStatus = async (college) => {
    try {
      await api.put(`/colleges/${college._id}`, { isActive: !college.isActive });
      toast.success(`College ${college.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchColleges();
    } catch (error) {
      toast.error('Failed to update college status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <button
          onClick={() => {
            setEditingCollege(null);
            setCollegeName('');
            setShowModal(true);
          }}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add College</span>
        </button>
      </div>

      {/* Student Password Reset Card */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg shadow-md p-6 mb-6 border-2 border-red-200 dark:border-red-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <KeyRound className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Student Password Reset
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reset passwords for students who have forgotten their credentials. This will clear their password and they'll need to register again.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/password-reset')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <KeyRound className="h-5 w-5" />
            <span>Reset Passwords</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Manage Colleges
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  College Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {colleges.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No colleges found. Add one to get started!
                  </td>
                </tr>
              ) : (
                colleges.map((college) => (
                  <tr key={college._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-primary-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {college.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(college)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          college.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {college.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(college.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(college)}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(college._id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingCollege ? 'Edit College' : 'Add New College'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g., SCIENT INSTITUTE OF TECHNOLOGY"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCollegeName('');
                    setEditingCollege(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingCollege ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
