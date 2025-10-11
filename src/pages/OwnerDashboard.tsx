import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Users, DollarSign, Settings,
  CheckCircle, XCircle, Upload, LogOut, Eye,
  UserCheck, UserX, Shield,
  MessageSquare, Activity, RefreshCw, Plus,
  Calendar, Package, BarChart3, FileSignature, Trash2, X, Trophy, Medal, Award
} from 'lucide-react';
import FinancialAnalytics from '../components/owner/FinancialAnalytics';
import ContractManagement from '../components/owner/ContractManagement';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalArticles: number;
  totalBlogPosts: number;
  todayVisitors: number;
  todayRevenue: number;
}

interface Submission {
  id: string;
  contentType: string;
  status: string;
  submittedAt: string;
  submittedBy: string;
  contentDetails: any;
}

interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  role: string;
  isBlacklisted: boolean;
  createdAt: string;
}

interface SiteSetting {
  value: string;
  type: string;
  updatedAt: string;
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [badgeStats, setBadgeStats] = useState<{ gold: number; silver: number; bronze: number; total: number } | null>(null);
  
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ 
    email: '', 
    firstName: '', 
    lastName: '', 
    role: 'editor',
    password: '' 
  });
  
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<{ id: string; currentRole: string } | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<{ id: string; name: string } | null>(null);
  
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      // First check localStorage for forcePasswordChange flag
      const ownerUserData = localStorage.getItem('ownerUser');
      if (ownerUserData) {
        const user = JSON.parse(ownerUserData);
        if (user.forcePasswordChange) {
          navigate('/owner/change-password');
          return;
        }
      }

      const response = await fetch('/api/admin/check', {
        credentials: 'include'
      });

      if (!response.ok) {
        navigate('/owner/login');
      }
    } catch (error) {
      navigate('/owner/login');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, submissionsRes, usersRes, settingsRes, badgesRes] = await Promise.all([
        fetch('/api/analytics/overview', { credentials: 'include' }),
        fetch('/api/approvals/pending', { credentials: 'include' }),
        fetch('/api/users?limit=100', { credentials: 'include' }),
        fetch('/api/settings', { credentials: 'include' }),
        fetch('/api/admin/badges/stats', { credentials: 'include' })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          totalUsers: statsData.realtime?.totalUsers || 0,
          activeUsers: statsData.snapshot?.activeUsers || 0,
          totalCourses: statsData.realtime?.totalArticles || 0,
          totalArticles: statsData.realtime?.totalArticles || 0,
          totalBlogPosts: statsData.realtime?.totalBlogPosts || 0,
          todayVisitors: statsData.snapshot?.uniqueVisitors || 0,
          todayRevenue: statsData.realtime?.todayRevenue || 0,
        });
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setPendingSubmissions(submissionsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      if (badgesRes.ok) {
        const badgesData = await badgesRes.json();
        setBadgeStats(badgesData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/approvals/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reviewNotes: 'Approved by owner' })
      });

      if (response.ok) {
        showNotification('success', 'Content approved successfully!');
        loadDashboardData();
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      showNotification('error', 'Failed to approve content');
    }
  };

  const handleReject = async (submissionId: string) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/approvals/${submissionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reviewNotes: reason })
      });

      if (response.ok) {
        showNotification('success', 'Content rejected');
        loadDashboardData();
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      showNotification('error', 'Failed to reject content');
    }
  };

  const handleBlacklistUser = async (userId: string, isBlacklisted: boolean) => {
    if (isBlacklisted) {
      try {
        const response = await fetch(`/api/users/${userId}/unblacklist`, {
          method: 'PUT',
          credentials: 'include'
        });

        if (response.ok) {
          showNotification('success', 'User unblacklisted');
          loadDashboardData();
        }
      } catch (error) {
        showNotification('error', 'Failed to unblacklist user');
      }
    } else {
      const reason = prompt('Reason for blacklisting:');
      if (!reason) return;

      try {
        const response = await fetch(`/api/users/${userId}/blacklist`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reason })
        });

        if (response.ok) {
          showNotification('success', 'User blacklisted');
          loadDashboardData();
        }
      } catch (error) {
        showNotification('error', 'Failed to blacklist user');
      }
    }
  };

  const handleChangeRole = (userId: string, currentRole: string) => {
    setSelectedUserForRole({ id: userId, currentRole });
    setNewRoleSelection(currentRole);
    setShowChangeRoleModal(true);
  };

  const confirmChangeRole = async () => {
    if (!selectedUserForRole) return;
    
    if (!['owner', 'admin', 'editor', 'viewer', 'consultant'].includes(newRoleSelection)) {
      showNotification('error', 'Invalid role');
      return;
    }

    try {
      const response = await fetch(`/api/users/${selectedUserForRole.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRoleSelection })
      });

      if (response.ok) {
        showNotification('success', `User role changed to ${newRoleSelection}`);
        setShowChangeRoleModal(false);
        setSelectedUserForRole(null);
        loadDashboardData();
      } else {
        showNotification('error', 'Failed to change user role');
      }
    } catch (error) {
      showNotification('error', 'Failed to change user role');
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.firstName || !newUserData.lastName || !newUserData.password) {
      showNotification('error', 'All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/users/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        showNotification('success', 'User created successfully!');
        setShowCreateUserModal(false);
        setNewUserData({ email: '', firstName: '', lastName: '', role: 'editor', password: '' });
        loadDashboardData();
      } else {
        const error = await response.json();
        showNotification('error', error.message || 'Failed to create user');
      }
    } catch (error) {
      showNotification('error', 'Failed to create user');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setSelectedUserForDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserForDelete) return;

    try {
      const response = await fetch(`/api/users/${selectedUserForDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('success', 'User deleted successfully');
        setShowDeleteModal(false);
        setSelectedUserForDelete(null);
        loadDashboardData();
      } else {
        showNotification('error', 'Failed to delete user');
      }
    } catch (error) {
      showNotification('error', 'Failed to delete user');
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/settings/logo/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        showNotification('success', 'Logo uploaded successfully');
        loadDashboardData();
      }
    } catch (error) {
      showNotification('error', 'Failed to upload logo');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      // Clear localStorage to remove cached user data
      localStorage.removeItem('ownerUser');
      navigate('/owner/login');
    } catch (error) {
      // Clear localStorage even on error
      localStorage.removeItem('ownerUser');
      navigate('/owner/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Owner Dashboard</h1>
                <p className="text-sm text-purple-100">Dr.MiMi Platform Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadDashboardData}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'analytics', label: 'Analytics Financiers', icon: BarChart3 },
            { id: 'contracts', label: 'Contrats', icon: FileSignature },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
                  { label: 'Active Users', value: stats?.activeUsers || 0, icon: Activity, color: 'green' },
                  { label: 'Today Visitors', value: stats?.todayVisitors || 0, icon: Eye, color: 'purple' },
                  { label: 'Today Revenue', value: `${stats?.todayRevenue || 0} DZD`, icon: DollarSign, color: 'pink' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Content Overview
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Articles', count: stats?.totalArticles || 0 },
                      { label: 'Blog Posts', count: stats?.totalBlogPosts || 0 },
                      { label: 'Courses', count: stats?.totalCourses || 0 },
                      { label: 'Pending Approvals', count: pendingSubmissions.length }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                      <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">New Content</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Support</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Products</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                      <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Events</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Badges Overview Section */}
              {badgeStats && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Badges Overview
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Gold</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{badgeStats.gold}</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-500/20 rounded-lg">
                          <Medal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Silver</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{badgeStats.silver}</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Bronze</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">{badgeStats.bronze}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{badgeStats.total}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Achievement badges awarded to students for completing courses, quizzes, and clinical cases
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FinancialAnalytics />
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContractManagement />
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Pending Approvals ({pendingSubmissions.length})
              </h2>

              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No pending submissions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map(submission => (
                    <div
                      key={submission.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded">
                              {submission.contentType}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {submission.contentDetails?.title || 'Untitled'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Submitted by: {submission.submittedBy}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  User Management ({users.filter(u => roleFilter === 'all' || u.role === roleFilter).length} users)
                </h2>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Admin/Editor
                </button>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'admin', 'editor', 'viewer', 'consultant'].map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      roleFilter === role
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">User</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Role</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => roleFilter === 'all' || u.role === roleFilter)
                      .slice(0, 20)
                      .map(user => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'owner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            user.role === 'editor' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isBlacklisted ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs font-medium rounded">
                              Blacklisted
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium rounded">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {user.role !== 'owner' && (
                              <>
                                <button
                                  onClick={() => handleBlacklistUser(user.id, user.isBlacklisted)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.isBlacklisted
                                      ? 'bg-green-100 hover:bg-green-200 text-green-600'
                                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                                  }`}
                                  title={user.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                                >
                                  {user.isBlacklisted ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleChangeRole(user.id, user.role)}
                                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                  title="Change Role"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Site Customization
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {settings.site_logo && (
                        <img
                          src={settings.site_logo.value}
                          alt="Site logo"
                          className="h-16 w-auto object-contain border border-gray-200 dark:border-gray-700 rounded-lg p-2"
                        />
                      )}
                      <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload New Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Font
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Inter</option>
                      <option>Poppins</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      defaultValue="#9333ea"
                      className="h-12 w-full rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create User Modal */}
        <AnimatePresence>
          {showCreateUserModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateUserModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Admin/Editor</h3>
                  <button
                    onClick={() => setShowCreateUserModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newUserData.firstName}
                      onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="First Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newUserData.lastName}
                      onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Last Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateUserModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Role Modal */}
        <AnimatePresence>
          {showChangeRoleModal && selectedUserForRole && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowChangeRoleModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change User Role</h3>
                  <button
                    onClick={() => setShowChangeRoleModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Current role: <span className="font-semibold text-gray-900 dark:text-white">{selectedUserForRole.currentRole}</span>
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select New Role
                  </label>
                  <select
                    value={newRoleSelection}
                    onChange={(e) => setNewRoleSelection(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowChangeRoleModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmChangeRole}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete User Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedUserForDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Delete User</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-900 dark:text-white mb-2">
                    Are you sure you want to delete this user?
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    User: <span className="font-semibold">{selectedUserForDelete.name}</span>
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OwnerDashboard;
