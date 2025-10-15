import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  BookOpen,
  BarChart3,
  X,
  Users,
  Trophy,
  Settings,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'Profile' },
    { to: '/student/entries', icon: BookOpen, label: 'My Entries' },
    { to: '/student/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/entry-tracking', icon: FileText, label: 'Entry Tracking' },
    { to: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 
          bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out z-40
          overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button - Mobile only */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeSidebar}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive(link.to)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
