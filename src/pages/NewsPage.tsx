// XXL Medical News Page for Dr.MiMi platform
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Filter,
  Search,
  Tag,
  Globe,
  Award,
  AlertCircle,
  ChevronRight,
  Eye,
  ThumbsUp,
  Bell
} from 'lucide-react';
import { useTheme, useMedicalEmojis } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

interface NewsArticle {
  id: string;
  title: string;
  titleEn: string;
  titleAr: string;
  subtitle: string;
  subtitleEn: string;
  subtitleAr: string;
  content: string;
  contentEn: string;
  contentAr: string;
  category: 'Research' | 'Clinical' | 'Technology' | 'Education' | 'Policy' | 'Conference';
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  imageUrl?: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  isBreaking: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  source: string;
  relatedModules: string[];
}

const NewsPage: React.FC = () => {
  const { isFeminine } = useTheme();
  const emojis = useMedicalEmojis();
  const { t, language, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // News categories
  const categories = [
    { id: 'all', name: language === 'en' ? 'All News' : language === 'ar' ? 'جميع الأخبار' : 'Toutes Actualités', icon: '📰' },
    { id: 'Research', name: language === 'en' ? 'Research' : language === 'ar' ? 'البحث' : 'Recherche', icon: '🔬' },
    { id: 'Clinical', name: language === 'en' ? 'Clinical' : language === 'ar' ? 'سريري' : 'Clinique', icon: '🏥' },
    { id: 'Technology', name: language === 'en' ? 'Technology' : language === 'ar' ? 'التكنولوجيا' : 'Technologie', icon: '💻' },
    { id: 'Education', name: language === 'en' ? 'Education' : language === 'ar' ? 'التعليم' : 'Éducation', icon: '🎓' },
    { id: 'Policy', name: language === 'en' ? 'Policy' : language === 'ar' ? 'السياسة' : 'Politique', icon: '📋' },
    { id: 'Conference', name: language === 'en' ? 'Conferences' : language === 'ar' ? 'المؤتمرات' : 'Conférences', icon: '🎤' },
  ];

  // Sample news articles
  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Nouvelle Avancée dans le Traitement du Cancer du Pancréas',
      titleEn: 'New Breakthrough in Pancreatic Cancer Treatment',
      titleAr: 'اكتشاف جديد في علاج سرطان البنكرياس',
      subtitle: 'Une étude révolutionnaire montre des résultats prometteurs avec une nouvelle immunothérapie',
      subtitleEn: 'Revolutionary study shows promising results with new immunotherapy',
      subtitleAr: 'دراسة ثورية تظهر نتائج واعدة مع العلاج المناعي الجديد',
      content: 'Des chercheurs de l\'Institut Curie ont découvert une nouvelle approche thérapeutique...',
      contentEn: 'Researchers at Curie Institute have discovered a new therapeutic approach...',
      contentAr: 'اكتشف باحثون في معهد كوري نهجًا علاجيًا جديدًا...',
      category: 'Research',
      author: 'Dr. Marie Leblanc',
      authorRole: 'Rédactrice Médicale Senior',
      publishedAt: '2024-03-25',
      readTime: 8,
      tags: ['Oncologie', 'Immunothérapie', 'Innovation'],
      views: 5234,
      likes: 892,
      comments: 67,
      shares: 234,
      isBreaking: true,
      isFeatured: true,
      isPremium: false,
      source: 'Institut Curie',
      relatedModules: ['oncology', 'immunology']
    },
    {
      id: '2',
      title: 'L\'IA Révolutionne le Diagnostic Précoce d\'Alzheimer',
      titleEn: 'AI Revolutionizes Early Alzheimer\'s Diagnosis',
      titleAr: 'الذكاء الاصطناعي يحدث ثورة في التشخيص المبكر لمرض الزهايمر',
      subtitle: 'Un algorithme détecte les signes précoces avec 95% de précision',
      subtitleEn: 'Algorithm detects early signs with 95% accuracy',
      subtitleAr: 'الخوارزمية تكتشف العلامات المبكرة بدقة 95%',
      content: 'Une équipe internationale a développé un système d\'intelligence artificielle...',
      contentEn: 'An international team has developed an artificial intelligence system...',
      contentAr: 'طور فريق دولي نظام ذكاء اصطناعي...',
      category: 'Technology',
      author: 'Prof. Jean Dupont',
      authorRole: 'Neurologue et Chercheur',
      publishedAt: '2024-03-24',
      readTime: 6,
      tags: ['Neurologie', 'IA', 'Diagnostic'],
      views: 4567,
      likes: 723,
      comments: 89,
      shares: 312,
      isBreaking: false,
      isFeatured: true,
      isPremium: false,
      source: 'Nature Medicine',
      relatedModules: ['neurology', 'radiology']
    },
    {
      id: '3',
      title: 'Congrès International de Cardiologie 2024 à Alger',
      titleEn: '2024 International Cardiology Congress in Algiers',
      titleAr: 'المؤتمر الدولي لأمراض القلب 2024 في الجزائر',
      subtitle: 'Plus de 2000 spécialistes attendus pour cet événement majeur',
      subtitleEn: 'Over 2000 specialists expected for this major event',
      subtitleAr: 'أكثر من 2000 متخصص متوقع لهذا الحدث الكبير',
      content: 'Le congrès rassemblera les plus grands experts mondiaux en cardiologie...',
      contentEn: 'The congress will bring together the world\'s leading cardiology experts...',
      contentAr: 'سيجمع المؤتمر أبرز خبراء أمراض القلب في العالم...',
      category: 'Conference',
      author: 'Comité d\'Organisation',
      authorRole: 'Société Algérienne de Cardiologie',
      publishedAt: '2024-03-23',
      readTime: 4,
      tags: ['Cardiologie', 'Congrès', 'Algérie'],
      views: 3890,
      likes: 456,
      comments: 34,
      shares: 178,
      isBreaking: false,
      isFeatured: false,
      isPremium: false,
      source: 'SAC',
      relatedModules: ['cardiology']
    },
    {
      id: '4',
      title: 'Réforme de la Formation Médicale en Algérie',
      titleEn: 'Medical Education Reform in Algeria',
      titleAr: 'إصلاح التعليم الطبي في الجزائر',
      subtitle: 'Nouvelles mesures pour améliorer la qualité de la formation',
      subtitleEn: 'New measures to improve training quality',
      subtitleAr: 'تدابير جديدة لتحسين جودة التدريب',
      content: 'Le Ministère de la Santé annonce une série de réformes majeures...',
      contentEn: 'The Ministry of Health announces a series of major reforms...',
      contentAr: 'تعلن وزارة الصحة عن سلسلة من الإصلاحات الكبرى...',
      category: 'Policy',
      author: 'Rédaction Dr.MiMi',
      authorRole: 'Équipe Éditoriale',
      publishedAt: '2024-03-22',
      readTime: 5,
      tags: ['Formation', 'Politique', 'Algérie'],
      views: 6234,
      likes: 892,
      comments: 156,
      shares: 423,
      isBreaking: true,
      isFeatured: false,
      isPremium: true,
      source: 'Ministère de la Santé',
      relatedModules: ['education']
    },
    {
      id: '5',
      title: 'Épidémie de Grippe: Recommandations pour les Étudiants',
      titleEn: 'Flu Epidemic: Recommendations for Students',
      titleAr: 'وباء الإنفلونزا: توصيات للطلاب',
      subtitle: 'Conseils pratiques pour se protéger pendant la saison grippale',
      subtitleEn: 'Practical advice to protect yourself during flu season',
      subtitleAr: 'نصائح عملية لحماية نفسك خلال موسم الإنفلونزا',
      content: 'Face à la recrudescence des cas de grippe, voici les mesures essentielles...',
      contentEn: 'Faced with the resurgence of flu cases, here are the essential measures...',
      contentAr: 'في مواجهة عودة حالات الإنفلونزا، إليك التدابير الأساسية...',
      category: 'Clinical',
      author: 'Dr. Fatima Benali',
      authorRole: 'Infectiologue',
      publishedAt: '2024-03-21',
      readTime: 3,
      tags: ['Prévention', 'Infectiologie', 'Santé Publique'],
      views: 7890,
      likes: 567,
      comments: 78,
      shares: 890,
      isBreaking: false,
      isFeatured: false,
      isPremium: false,
      source: 'CHU Mustapha',
      relatedModules: ['infectiology', 'public-health']
    }
  ];

  // Filter articles
  const filteredArticles = useMemo(() => {
    let filtered = newsArticles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(a => a.isFeatured);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.titleEn.toLowerCase().includes(term) ||
        a.titleAr.includes(term) ||
        a.subtitle.toLowerCase().includes(term) ||
        a.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
    }

    return filtered;
  }, [selectedCategory, showFeaturedOnly, searchTerm, sortBy]);

  // Get article title based on language
  const getArticleTitle = (article: NewsArticle) => {
    if (language === 'en') return article.titleEn;
    if (language === 'ar') return article.titleAr;
    return article.title;
  };

  const getArticleSubtitle = (article: NewsArticle) => {
    if (language === 'en') return article.subtitleEn;
    if (language === 'ar') return article.subtitleAr;
    return article.subtitle;
  };

  // Featured article (first featured article)
  const featuredArticle = newsArticles.find(a => a.isFeatured);

  return (
    <motion.div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {t('nav.news')} 📰
            {isFeminine && ' 💕'}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>
            {language === 'en'
              ? 'Stay updated with the latest medical news and breakthroughs'
              : language === 'ar'
              ? 'ابق على اطلاع بآخر الأخبار والاكتشافات الطبية'
              : 'Restez informé des dernières actualités et avancées médicales'}
          </p>
        </motion.div>

        {/* Breaking News Alert */}
        {newsArticles.some(a => a.isBreaking) && (
          <motion.div
            className="mb-6 p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderLeftColor: 'var(--color-error)',
            }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} style={{ color: 'var(--color-error)' }} />
              <span className="font-semibold text-red-600">
                {language === 'en' ? 'BREAKING' : language === 'ar' ? 'عاجل' : 'URGENT'}
              </span>
            </div>
            <p style={{ color: 'var(--color-text)' }}>
              {getArticleTitle(newsArticles.find(a => a.isBreaking)!)}
            </p>
          </motion.div>
        )}

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat.id ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.id
                    ? 'var(--color-primary)'
                    : 'var(--color-surface)',
                  color: selectedCategory === cat.id
                    ? 'white'
                    : 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2`}
              style={{ color: 'var(--color-textSecondary)' }}
            />
            <input
              type="text"
              placeholder={language === 'en'
                ? 'Search articles...'
                : language === 'ar'
                ? 'البحث عن المقالات...'
                : 'Rechercher articles...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-lg border`}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="recent">{language === 'en' ? 'Most Recent' : language === 'ar' ? 'الأحدث' : 'Plus Récent'}</option>
            <option value="popular">{language === 'en' ? 'Most Popular' : language === 'ar' ? 'الأكثر شعبية' : 'Plus Populaire'}</option>
            <option value="trending">{language === 'en' ? 'Trending' : language === 'ar' ? 'الأكثر رواجًا' : 'Tendance'}</option>
          </select>

          {/* Featured Filter */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border"
               style={{
                 backgroundColor: 'var(--color-surface)',
                 borderColor: 'var(--color-border)',
               }}>
            <input
              type="checkbox"
              id="featured"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="featured" className="cursor-pointer" style={{ color: 'var(--color-text)' }}>
              <Award size={16} className="inline mr-1" />
              {language === 'en' ? 'Featured Only' : language === 'ar' ? 'المميز فقط' : 'À la Une'}
            </label>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && !showFeaturedOnly && (
          <motion.div
            className="mb-8 rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Newspaper size={80} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    <Award size={14} className="inline mr-1" />
                    {language === 'en' ? 'Featured' : language === 'ar' ? 'مميز' : 'À la Une'}
                  </span>
                  {featuredArticle.isBreaking && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {language === 'en' ? 'Breaking' : language === 'ar' ? 'عاجل' : 'Urgent'}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                  {getArticleTitle(featuredArticle)}
                </h2>
                <p className="mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                  {getArticleSubtitle(featuredArticle)}
                </p>
                <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {featuredArticle.readTime} min
                  </span>
                </div>
                <button
                  className="px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                  }}
                >
                  {language === 'en' ? 'Read More' : language === 'ar' ? 'اقرأ المزيد' : 'Lire Plus'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.filter(a => !showFeaturedOnly || a !== featuredArticle).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                getArticleTitle={getArticleTitle}
                getArticleSubtitle={getArticleSubtitle}
                language={language}
                isRTL={isRTL}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'No articles found' : language === 'ar' ? 'لم يتم العثور على مقالات' : 'Aucun article trouvé'}
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {language === 'en'
                ? 'Try adjusting your search criteria'
                : language === 'ar'
                ? 'حاول تعديل معايير البحث'
                : 'Essayez de modifier vos critères de recherche'}
            </p>
          </motion.div>
        )}

        {/* Newsletter Subscription */}
        {isAuthenticated && (
          <motion.div
            className="mt-12 p-6 rounded-xl text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell size={48} className="mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'Stay Informed' : language === 'ar' ? 'ابق على اطلاع' : 'Restez Informé'}
            </h3>
            <p className="mb-4" style={{ color: 'var(--color-textSecondary)' }}>
              {language === 'en'
                ? 'Get the latest medical news delivered to your inbox'
                : language === 'ar'
                ? 'احصل على آخر الأخبار الطبية في بريدك الإلكتروني'
                : 'Recevez les dernières actualités médicales dans votre boîte mail'}
            </p>
            <button
              className="px-6 py-3 rounded-lg font-medium"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              {language === 'en' ? 'Subscribe to Newsletter' : language === 'ar' ? 'اشترك في النشرة الإخبارية' : 'S\'abonner à la Newsletter'}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Article Card Component
const ArticleCard: React.FC<{
  article: NewsArticle;
  getArticleTitle: (a: NewsArticle) => string;
  getArticleSubtitle: (a: NewsArticle) => string;
  language: string;
  isRTL: boolean;
}> = ({ article, getArticleTitle, getArticleSubtitle, language, isRTL }) => {
  const [isSaved, setIsSaved] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Research': '#8B5CF6',
      'Clinical': '#10B981',
      'Technology': '#3B82F6',
      'Education': '#F59E0B',
      'Policy': '#EF4444',
      'Conference': '#EC4899',
    };
    return colors[category] || 'var(--color-primary)';
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-lg cursor-pointer h-full flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      layout
    >
      {/* Image/Header */}
      <div
        className="h-48 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${getCategoryColor(article.category)}22 0%, ${getCategoryColor(article.category)}11 100%)`
        }}
      >
        {/* Category Badge */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: getCategoryColor(article.category) }}
          >
            {article.category}
          </span>
        </div>

        {/* Premium Badge */}
        {article.isPremium && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Premium
            </div>
          </div>
        )}

        {/* Breaking Badge */}
        {article.isBreaking && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
              {language === 'en' ? 'BREAKING' : language === 'ar' ? 'عاجل' : 'URGENT'}
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <Newspaper size={64} style={{ color: getCategoryColor(article.category), opacity: 0.3 }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>
          {getArticleTitle(article)}
        </h3>

        {/* Subtitle */}
        <p className="text-sm mb-3 line-clamp-2 flex-1" style={{ color: 'var(--color-textSecondary)' }}>
          {getArticleSubtitle(article)}
        </p>

        {/* Author and Date */}
        <div className="flex items-center gap-3 mb-3 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
          <span className="flex items-center gap-1">
            <User size={14} />
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {article.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-lg"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-textSecondary)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-3 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={14} />
              {article.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {article.comments}
            </span>
          </div>
          <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <Clock size={14} className="inline mr-1" />
            {article.readTime} min
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
          >
            {language === 'en' ? 'Read' : language === 'ar' ? 'اقرأ' : 'Lire'}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: isSaved ? 'var(--color-primary)' : 'var(--color-textSecondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-textSecondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsPage;