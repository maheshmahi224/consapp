import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Search,
  Eye,
  Phone,
  Github,
  Code,
  Linkedin,
  FileText,
  ExternalLink,
  X,
  MessageSquare
} from 'lucide-react';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentEntries, setStudentEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchColleges();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterCollege, filterYear]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to fetch colleges');
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCollege) {
      filtered = filtered.filter((s) => s.college === filterCollege);
    }

    if (filterYear) {
      filtered = filtered.filter((s) => s.year === filterYear);
    }

    setFilteredStudents(filtered);
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const response = await api.get(`/users/student/${studentId}`);
      setSelectedStudent(response.data.student);
      setStudentEntries(response.data.entries);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch student details');
    }
  };

  const addRemark = async (entryId) => {
    if (!remarkText.trim()) {
      toast.error('Please enter a remark');
      return;
    }

    try {
      await api.post(`/entries/${entryId}/remark`, { comment: remarkText });
      toast.success('Remark added successfully');
      setRemarkText('');
      setSelectedEntryId(null);
      // Refresh student details
      viewStudentDetails(selectedStudent._id);
    } catch (error) {
      toast.error('Failed to add remark');
    }
  };

  const openLink = (url) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Student Management</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterCollege}
            onChange={(e) => setFilterCollege(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Colleges</option>
            {colleges.map((college) => (
              <option key={college._id} value={college.name}>
                {college.name}
              </option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No students found
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <p>
                  <span className="font-medium">Year:</span> {student.year}
                </p>
                <p>
                  <span className="font-medium">College:</span> {student.college}
                </p>
                {student.department && (
                  <p>
                    <span className="font-medium">Department:</span> {student.department}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => viewStudentDetails(student._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
                {student.phone && (
                  <a
                    href={`tel:${student.phone}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Phone:</span> {selectedStudent.phone}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Year:</span> {selectedStudent.year}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">College:</span> {selectedStudent.college}
                    </p>
                    {selectedStudent.department && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Department:</span> {selectedStudent.department}
                      </p>
                    )}
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Joined:</span>{' '}
                      {new Date(selectedStudent.dateOfJoining).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Professional Links
                  </h3>
                  <div className="space-y-2">
                    {selectedStudent.github && (
                      <button
                        onClick={() => openLink(selectedStudent.github)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {selectedStudent.leetcode && (
                      <button
                        onClick={() => openLink(selectedStudent.leetcode)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <Code className="h-4 w-4" />
                        <span>LeetCode Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {selectedStudent.hackerrank && (
                      <button
                        onClick={() => openLink(selectedStudent.hackerrank)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <Code className="h-4 w-4" />
                        <span>HackerRank Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {selectedStudent.linkedin && (
                      <button
                        onClick={() => openLink(selectedStudent.linkedin)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {selectedStudent.resume && (
                      <button
                        onClick={() => openLink(selectedStudent.resume)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Resume</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {selectedStudent.passionateAbout && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Passionate About
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedStudent.passionateAbout}
                  </p>
                </div>
              )}

              {/* Daily Entries */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Daily Learning Entries ({studentEntries.length})
                </h3>
                {studentEntries.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No entries yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {studentEntries.map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.timeDuration.hours}h {entry.timeDuration.minutes}m •{' '}
                              {entry.mood} • {entry.learningType}
                            </p>
                          </div>
                          {entry.tag && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-xs rounded-full">
                              {entry.tag}
                            </span>
                          )}
                        </div>

                        {entry.concepts && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Concepts:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.concepts}
                            </p>
                          </div>
                        )}

                        {entry.problemsPracticed && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Problems:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.problemsPracticed}
                            </p>
                          </div>
                        )}

                        {entry.doubts && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Doubts:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.doubts}
                            </p>
                          </div>
                        )}

                        {/* Admin Remarks */}
                        {entry.adminRemarks && entry.adminRemarks.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Admin Remarks:
                            </p>
                            {entry.adminRemarks.map((remark, idx) => (
                              <div
                                key={idx}
                                className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm mb-1"
                              >
                                <p className="text-gray-700 dark:text-gray-300">{remark.comment}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(remark.date).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Remark */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {selectedEntryId === entry._id ? (
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={remarkText}
                                onChange={(e) => setRemarkText(e.target.value)}
                                placeholder="Add a remark..."
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                              />
                              <button
                                onClick={() => addRemark(entry._id)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedEntryId(null);
                                  setRemarkText('');
                                }}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedEntryId(entry._id)}
                              className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>Add Remark</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
