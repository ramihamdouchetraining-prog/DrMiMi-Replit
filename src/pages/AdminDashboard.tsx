import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  BarChart3,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Upload,
  Settings,
  UserCheck,
  UserX,
  Crown,
  Eye,
  Download,
  Clock,
  Sparkles,
  BookOpen,
  Image,
  PenTool,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Flower2,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isBlacklisted: boolean;
  createdAt: string;
  yearOfStudy?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  featured: boolean;
  status: string;
  createdAt?: string;
  viewCount?: number;
  likeCount?: number;
}

interface CourseData {
  id?: string;
  title: string;
  moduleId: string;
  description?: string;
  yearLevels: string[];
  price: number;
  status: string;
}

interface MedicalImage {
  id: string;
  filename: string;
  url: string;
  tags: string[];
  description: string;
  uploadedAt: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalSummaries: number;
  totalBlogPosts: number;
  todayVisitors: number;
  weekRevenue: number;
}

// Custom hooks for API calls
const useAdminCheck = () => {
  return useQuery({
    queryKey: ['adminCheck'],
    queryFn: async () => {
      const response = await fetch('/api/admin/check', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to check admin status');
      return response.json();
    }
  });
};

const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });
};

const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });
};

const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });
};

const AdminDashboard: React.FC = () => {
  const { isFeminine, isMagical } = useTheme();
  // const emojis = useMedicalEmojis(); // Not used
  // const { t } = useLanguage(); // Not used
  const queryClient = useQueryClient();
  
  // State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState<BlogPost>({
    title: '',
    content: '',
    category: 'Actualités',
    excerpt: '',
    tags: [],
    featured: false,
    status: 'draft'
  });
  const [courseFormData, setCourseFormData] = useState<CourseData>({
    title: '',
    moduleId: '',
    yearLevels: [],
    price: 0,
    status: 'draft'
  });
  const [uploadedImages, setUploadedImages] = useState<MedicalImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  // API Hooks
  const { data: adminCheck, isLoading: checkingAdmin } = useAdminCheck();
  const { data: stats } = useDashboardStats();
  const { data: users } = useAdminUsers();
  const { data: blogPosts } = useBlogPosts();

  // Check if user is admin
  useEffect(() => {
    if (adminCheck && !adminCheck.isAdmin) {
      setNotification({ type: 'error', message: 'Accès refusé. Vous n\'êtes pas administrateur.' });
    }
  }, [adminCheck]);

  // Blog post mutation
  const createBlogPost = useMutation({
    mutationFn: async (post: BlogPost) => {
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(post)
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      showNotification('success', 'Article créé avec succès! ✨');
      setBlogFormData({
        title: '',
        content: '',
        category: 'Actualités',
        excerpt: '',
        tags: [],
        featured: false,
        status: 'draft'
      });
    }
  });

  // File upload with drag & drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      
      fetch('/api/admin/files', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        showNotification('success', `Fichier ${file.name} uploadé avec succès! 🎉`);
        if (file.type.startsWith('image/')) {
          setUploadedImages(prev => [...prev, {
            id: data.id,
            filename: file.name,
            url: data.url,
            tags: [],
            description: '',
            uploadedAt: new Date().toISOString()
          }]);
        }
      })
      .catch(() => {
        showNotification('error', `Erreur lors de l'upload de ${file.name}`);
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  // Show notification
  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Toggle user blacklist
  const toggleUserBlacklist = async (userId: string, isBlacklisted: boolean) => {
    const endpoint = isBlacklisted 
      ? `/api/admin/users/${userId}/blacklist`
      : `/api/admin/users/${userId}/blacklist`;
    
    const response = await fetch(endpoint, {
      method: isBlacklisted ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason: 'Admin action' })
    });

    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      showNotification('success', isBlacklisted ? 'Utilisateur débloqué! 🔓' : 'Utilisateur bloqué! 🔒');
    }
  };

  // Render loading or access denied
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={48} style={{ color: 'var(--color-primary)' }} />
        </motion.div>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Lock size={64} style={{ color: 'var(--color-primary)' }} className="mb-4" />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Accès Refusé
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Cette page est réservée aux administrateurs.
        </p>
      </motion.div>
    );
  }

  // Chart colors for feminine theme
  const chartColors = isFeminine 
    ? ['#FF69B4', '#FFB6C1', '#DDA0DD', '#F0E68C', '#98FB98']
    : ['#0FA3B1', '#1363DF', '#F59E0B', '#10B981', '#8B5CF6'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <motion.div 
        className="p-6 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown size={32} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                Tableau de Bord Administrateur {isFeminine && '👑'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Bienvenue, {adminCheck?.user?.firstName} {adminCheck?.user?.lastName} ✨
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2`}
            style={{
              backgroundColor: notification.type === 'success' ? '#10B981' : '#EF4444',
              color: 'white'
            }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
            { id: 'courses', label: 'Gestion des Cours', icon: BookOpen },
            { id: 'blog', label: 'Blog', icon: PenTool },
            { id: 'images', label: 'Bibliothèque d\'Images', icon: Image },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'revenue', label: 'Revenus', icon: DollarSign }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id ? 'shadow-md' : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: activeTab === tab.id 
                  ? 'var(--color-primary)' 
                  : isFeminine ? '#FFE4E1' : 'var(--color-surface)',
                color: activeTab === tab.id ? 'white' : 'var(--color-text)',
                border: `1px solid ${activeTab === tab.id ? 'transparent' : 'var(--color-border)'}`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {isMagical && activeTab === tab.id && <Sparkles size={16} />}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Utilisateurs Total"
                  value={stats?.totalUsers || 0}
                  icon={<Users size={24} />}
                  color={chartColors[0]}
                  trend="+12%"
                  emoji="👥"
                />
                <StatCard
                  title="Visiteurs Aujourd'hui"
                  value={stats?.todayVisitors || 0}
                  icon={<Eye size={24} />}
                  color={chartColors[1]}
                  trend="+5%"
                  emoji="👀"
                />
                <StatCard
                  title="Revenus (Semaine)"
                  value={`${stats?.weekRevenue || 0} DZD`}
                  icon={<DollarSign size={24} />}
                  color={chartColors[2]}
                  trend="+18%"
                  emoji="💰"
                />
                <StatCard
                  title="Cours Publiés"
                  value={stats?.totalCourses || 0}
                  icon={<BookOpen size={24} />}
                  color={chartColors[3]}
                  emoji="📚"
                />
              </div>

              {/* Revenue Chart */}
              <motion.div
                className="p-6 rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <TrendingUp size={24} />
                  Évolution des Revenus {isFeminine && '💕'}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { name: 'Lun', revenue: 1200, users: 45 },
                    { name: 'Mar', revenue: 1800, users: 52 },
                    { name: 'Mer', revenue: 1400, users: 48 },
                    { name: 'Jeu', revenue: 2200, users: 61 },
                    { name: 'Ven', revenue: 1900, users: 55 },
                    { name: 'Sam', revenue: 2400, users: 72 },
                    { name: 'Dim', revenue: 1650, users: 58 }
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[1]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColors[1]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" stroke="var(--color-textSecondary)" />
                    <YAxis stroke="var(--color-textSecondary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke={chartColors[0]} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="users" stroke={chartColors[1]} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                className="p-6 rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Clock size={24} />
                  Activité Récente {isFeminine && '✨'}
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Nouvel utilisateur inscrit', user: 'Sarah Ahmed', time: 'Il y a 5 min', icon: UserCheck },
                    { action: 'Cours publié', user: 'Admin', time: 'Il y a 15 min', icon: BookOpen },
                    { action: 'Article de blog créé', user: 'Merieme', time: 'Il y a 1h', icon: PenTool },
                    { action: 'Fichier uploadé', user: 'Youcef', time: 'Il y a 2h', icon: Upload }
                  ].map((activity, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-background)' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <activity.icon size={20} style={{ color: chartColors[idx % chartColors.length] }} />
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{activity.action}</p>
                          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>par {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Form */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="p-6 rounded-xl shadow-lg"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                      <PenTool size={24} />
                      Créer un Article {isFeminine && '✍️💕'}
                    </h3>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Titre de l'article"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      />
                      
                      <textarea
                        placeholder="Résumé de l'article"
                        value={blogFormData.excerpt}
                        onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      />
                      
                      <select
                        value={blogFormData.category}
                        onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border"
                        style={{ 
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      >
                        <option value="Actualités">Actualités</option>
                        <option value="Conseils">Conseils</option>
                        <option value="Études">Études</option>
                        <option value="Carrière">Carrière</option>
                        <option value="Innovation">Innovation</option>
                      </select>
                      
                      <div style={{ minHeight: '300px' }}>
                        <ReactQuill
                          value={blogFormData.content}
                          onChange={(content) => setBlogFormData({ ...blogFormData, content })}
                          theme="snow"
                          placeholder="Écrivez votre article ici..."
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'color': [] }, { 'background': [] }],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'image', 'video'],
                              ['clean']
                            ]
                          }}
                          style={{
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text)',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={blogFormData.featured}
                            onChange={(e) => setBlogFormData({ ...blogFormData, featured: e.target.checked })}
                          />
                          <span style={{ color: 'var(--color-text)' }}>Article mis en avant</span>
                        </label>
                        
                        <select
                          value={blogFormData.status}
                          onChange={(e) => setBlogFormData({ ...blogFormData, status: e.target.value })}
                          className="px-4 py-2 rounded-lg border"
                          style={{ 
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)'
                          }}
                        >
                          <option value="draft">Brouillon</option>
                          <option value="published">Publié</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => createBlogPost.mutate(blogFormData)}
                          className="flex items-center space-x-2 px-6 py-2 rounded-lg text-white"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save size={18} />
                          <span>Publier</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setBlogFormData({
                            title: '',
                            content: '',
                            category: 'Actualités',
                            excerpt: '',
                            tags: [],
                            featured: false,
                            status: 'draft'
                          })}
                          className="flex items-center space-x-2 px-6 py-2 rounded-lg"
                          style={{ 
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={18} />
                          <span>Annuler</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Blog List */}
                <div className="lg:col-span-1">
                  <motion.div
                    className="p-6 rounded-xl shadow-lg"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                      <FileText size={24} />
                      Articles Récents
                    </h3>
                    
                    <div className="space-y-3">
                      {blogPosts?.slice(0, 5).map((post: any, idx: number) => (
                        <motion.div
                          key={post.id || idx}
                          className="p-3 rounded-lg cursor-pointer"
                          style={{ backgroundColor: 'var(--color-background)' }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedBlogPost(post)}
                        >
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{post.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs px-2 py-1 rounded" 
                              style={{ 
                                backgroundColor: post.status === 'published' ? '#10B981' : '#F59E0B',
                                color: 'white'
                              }}>
                              {post.status === 'published' ? 'Publié' : 'Brouillon'}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                              {post.viewCount || 0} vues
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* File Upload Area */}
              <div
                className="p-8 rounded-xl shadow-lg text-center"
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: isDragActive ? 'var(--color-primary)' : 'var(--color-border)',
                  border: '2px dashed',
                  borderWidth: '2px'
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Upload size={48} style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
                <p className="mt-4 text-lg" style={{ color: 'var(--color-text)' }}>
                  {isDragActive 
                    ? 'Déposez les fichiers ici...' 
                    : 'Glissez-déposez vos fichiers PDF/Word ici'}
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-textSecondary)' }}>
                  ou cliquez pour sélectionner
                </p>
                {isFeminine && <Sparkles className="mx-auto mt-4" size={24} style={{ color: 'var(--color-primary)' }} />}
              </div>

              {/* Course Creation Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  className="p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                    <BookOpen size={24} />
                    Créer un Cours
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Titre du cours"
                      value={courseFormData.title}
                      onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    />
                    
                    <select
                      value={courseFormData.moduleId}
                      onChange={(e) => setCourseFormData({ ...courseFormData, moduleId: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    >
                      <option value="">Sélectionner un module</option>
                      <option value="cardiology">Cardiologie</option>
                      <option value="neurology">Neurologie</option>
                      <option value="anatomy">Anatomie</option>
                      <option value="pharmacology">Pharmacologie</option>
                    </select>
                    
                    <div>
                      <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                        Niveaux d'étude
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Intern'].map(level => (
                          <label key={level} className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={courseFormData.yearLevels.includes(level)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCourseFormData({ 
                                    ...courseFormData, 
                                    yearLevels: [...courseFormData.yearLevels, level] 
                                  });
                                } else {
                                  setCourseFormData({ 
                                    ...courseFormData, 
                                    yearLevels: courseFormData.yearLevels.filter(l => l !== level) 
                                  });
                                }
                              }}
                            />
                            <span style={{ color: 'var(--color-text)' }}>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <input
                      type="number"
                      placeholder="Prix (DZD)"
                      value={courseFormData.price}
                      onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    />
                    
                    <motion.button
                      className="w-full py-2 rounded-lg text-white"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Créer le Cours
                    </motion.button>
                  </div>
                </motion.div>

                {/* Recent Courses */}
                <motion.div
                  className="p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                    <FileText size={24} />
                    Cours Récents
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'Cardiologie - ECG', module: 'Cardiologie', status: 'published', price: 250 },
                      { title: 'Neurologie - AVC', module: 'Neurologie', status: 'draft', price: 180 },
                      { title: 'Anatomie - Thorax', module: 'Anatomie', status: 'published', price: 200 }
                    ].map((course, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: 'var(--color-background)' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{course.title}</p>
                          <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{course.module}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                            {course.price} DZD
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            course.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                          } text-white`}>
                            {course.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Image Upload */}
              <div
                className="p-8 rounded-xl shadow-lg text-center"
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderColor: 'var(--color-border)',
                  border: '2px dashed',
                  borderWidth: '2px'
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Image size={48} style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
                <p className="mt-4 text-lg" style={{ color: 'var(--color-text)' }}>
                  Glissez-déposez vos images médicales ici
                </p>
                {isFeminine && <Flower2 className="mx-auto mt-4" size={24} style={{ color: 'var(--color-primary)' }} />}
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, idx) => (
                  <motion.div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={image.url} 
                      alt={image.filename}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <motion.button
                        className="p-2 bg-white rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download size={16} />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xs truncate">{image.filename}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total"
                  value={users?.length || 0}
                  icon={<Users size={24} />}
                  color={chartColors[0]}
                  emoji="👥"
                />
                <StatCard
                  title="Étudiants"
                  value={users?.filter((u: AdminUser) => u.role === 'student').length || 0}
                  icon={<BookOpen size={24} />}
                  color={chartColors[1]}
                  emoji="👨‍🎓"
                />
                <StatCard
                  title="Créateurs"
                  value={users?.filter((u: AdminUser) => u.role === 'creator').length || 0}
                  icon={<PenTool size={24} />}
                  color={chartColors[2]}
                  emoji="✍️"
                />
                <StatCard
                  title="Bloqués"
                  value={users?.filter((u: AdminUser) => u.isBlacklisted).length || 0}
                  icon={<UserX size={24} />}
                  color="#EF4444"
                  emoji="🚫"
                />
              </div>

              {/* User Table */}
              <motion.div
                className="p-6 rounded-xl shadow-lg overflow-x-auto"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Users size={24} />
                  Liste des Utilisateurs
                </h3>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 rounded-lg border"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  />
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Nom</th>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Email</th>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Rôle</th>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Année</th>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Statut</th>
                      <th className="text-left p-2" style={{ color: 'var(--color-text)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.filter((u: AdminUser) => 
                      searchQuery === '' || 
                      u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).slice(0, 10).map((user: AdminUser) => (
                      <motion.tr 
                        key={user.id}
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: 'var(--color-background)' }}
                      >
                        <td className="p-2" style={{ color: 'var(--color-text)' }}>
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-2" style={{ color: 'var(--color-textSecondary)' }}>{user.email}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded text-xs" style={{
                            backgroundColor: user.role === 'admin' ? chartColors[0] : 
                                          user.role === 'creator' ? chartColors[1] : 
                                          chartColors[2],
                            color: 'white'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-2" style={{ color: 'var(--color-text)' }}>{user.yearOfStudy || '-'}</td>
                        <td className="p-2">
                          {user.isBlacklisted ? (
                            <span className="flex items-center text-red-500">
                              <Lock size={16} className="mr-1" />
                              Bloqué
                            </span>
                          ) : (
                            <span className="flex items-center text-green-500">
                              <Unlock size={16} className="mr-1" />
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <motion.button
                            onClick={() => toggleUserBlacklist(user.id, user.isBlacklisted)}
                            className="p-1 rounded"
                            style={{ 
                              backgroundColor: user.isBlacklisted ? '#10B981' : '#EF4444',
                              color: 'white'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {user.isBlacklisted ? <Unlock size={16} /> : <Lock size={16} />}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </motion.div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Overview */}
                <motion.div
                  className="p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                    <DollarSign size={24} />
                    Revenus Mensuels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', revenue: 45000 },
                      { month: 'Fév', revenue: 52000 },
                      { month: 'Mar', revenue: 48000 },
                      { month: 'Avr', revenue: 61000 },
                      { month: 'Mai', revenue: 55000 },
                      { month: 'Juin', revenue: 67000 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-textSecondary)" />
                      <YAxis stroke="var(--color-textSecondary)" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={chartColors[0]} 
                        strokeWidth={3}
                        dot={{ fill: chartColors[0], strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Revenue by Category */}
                <motion.div
                  className="p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                    <BarChart3 size={24} />
                    Répartition des Revenus
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Cours', value: 45 },
                          { name: 'Résumés', value: 30 },
                          { name: 'Premium', value: 25 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {[0, 1, 2].map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Recent Transactions */}
              <motion.div
                className="p-6 rounded-xl shadow-lg mt-6"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                whileHover={{ boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1)' }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <TrendingUp size={24} />
                  Transactions Récentes {isFeminine && '💰'}
                </h3>
                <div className="space-y-3">
                  {[
                    { user: 'Sarah Ahmed', item: 'Cours Cardiologie', amount: 250, date: '28 Sep 2025' },
                    { user: 'Mohamed Ali', item: 'Résumé Neurologie', amount: 180, date: '28 Sep 2025' },
                    { user: 'Fatima Zahra', item: 'Abonnement Premium', amount: 500, date: '27 Sep 2025' },
                    { user: 'Karim Benali', item: 'Cours Anatomie', amount: 200, date: '27 Sep 2025' }
                  ].map((transaction, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-background)' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>{transaction.user}</p>
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>{transaction.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: chartColors[1] }}>+{transaction.amount} DZD</p>
                        <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>{transaction.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  emoji?: string;
}> = ({ title, value, icon, color, trend, emoji }) => {
  const { isFeminine } = useTheme();
  
  return (
    <motion.div
      className="p-6 rounded-xl shadow-lg"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: isFeminine ? '0 10px 25px rgba(236, 72, 153, 0.1)' : '0 10px 25px rgba(15, 163, 177, 0.1)'
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-70" style={{ color: 'var(--color-textSecondary)' }}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>
            {value}
          </p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={14} className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div 
            className="p-3 rounded-full mb-2"
            style={{ backgroundColor: color + '20', color: color }}
          >
            {icon}
          </div>
          {emoji && <span className="text-2xl">{emoji}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;