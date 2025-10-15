import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, KeyRound, AlertTriangle, ArrowLeft, User, Mail, Building2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [colleges, setColleges] = useState([]);
  const [resettingId, setResettingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchColleges();
  }, []);

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, searchTerm, filterCollege, filterYear]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error('Fetch students error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response.data.filter(c => c.isActive));
    } catch (error) {
      console.error('Failed to fetch colleges');
    }
  };

  const filterData = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // College filter
    if (filterCollege) {
      filtered = filtered.filter((student) => student.college === filterCollege);
    }

    // Year filter
    if (filterYear) {
      filtered = filtered.filter((student) => student.year === filterYear);
    }

    setFilteredStudents(filtered);
  };

  const handleResetPassword = (student) => {
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  const confirmResetPassword = async () => {
    if (!selectedStudent) return;

    setShowConfirmModal(false);
    setResettingId(selectedStudent._id);
    
    try {
      await api.post(`/admin/reset-password/${selectedStudent._id}`);
      toast.success(`Password reset successfully for ${selectedStudent.name}. They can now register again.`);
      // Optionally refresh the list
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingId(null);
      setSelectedStudent(null);
    }
  };

  const cancelResetPassword = () => {
    setShowConfirmModal(false);
    setSelectedStudent(null);
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
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/settings')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Settings
        </button>
        
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <KeyRound className="h-8 w-8" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Student Password Reset</h1>
              <p className="mt-1 text-red-100">Emergency password reset for students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Important Warning</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              Resetting a student's password will delete their current password. The student will need to register again using the same email address. All their learning data, entries, and progress will be preserved.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Search & Filter Students
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* College Filter */}
          <div>
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Colleges</option>
              {colleges.map((college) => (
                <option key={college._id} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-primary-600">{filteredStudents.length}</span> of{' '}
          <span className="font-bold">{students.length}</span> students
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                  College
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden lg:table-cell">
                  Registered
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm || filterCollege || filterYear
                        ? 'No students found matching your filters'
                        : 'No students registered yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {student.email}
                          </div>
                          {student.rollNumber && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Roll: {student.rollNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-[200px]">{student.college}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                      {student.year}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleResetPassword(student)}
                        disabled={resettingId === student._id}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resettingId === student._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="hidden sm:inline">Resetting...</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4" />
                            <span className="hidden sm:inline">Reset Password</span>
                            <span className="sm:hidden">Reset</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
          💡 How Password Reset Works
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Click "Reset Password" for the student who forgot their credentials</li>
          <li>Their password will be cleared from the system</li>
          <li>Student should visit the registration page and register again with the same email</li>
          <li>All their previous data (entries, progress, analytics) will be linked to their account</li>
          <li>They can continue from where they left off with a new password</li>
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
              ⚠️ Confirm Password Reset
            </h2>

            {/* Student Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Student Name:</span>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedStudent.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedStudent.email}</p>
                </div>
                {selectedStudent.rollNumber && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Roll Number:</span>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedStudent.rollNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              <h3 className="text-sm font-bold text-red-800 dark:text-red-300 mb-2">
                This action will:
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Delete their current password permanently</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Require them to register again with the same email</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Preserve all their data (entries, progress, analytics)</span>
                </li>
              </ul>
            </div>

            {/* Confirmation Question */}
            <p className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Are you absolutely sure you want to reset this password?
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelResetPassword}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ❌ No, Cancel
              </button>
              <button
                onClick={confirmResetPassword}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                ✅ Yes, Reset Password
              </button>
            </div>

            {/* Additional Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              This action cannot be undone. The student will be notified to re-register.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
