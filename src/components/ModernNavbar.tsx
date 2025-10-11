import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  FileText,
  Layers,
  CheckCircle,
  Library,
  Activity,
  Newspaper,
  User,
  Heart,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface NavItem {
  icon: any;
  label: string;
  href: string;
  highlight?: boolean;
}

export const ModernNavbar: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems: NavItem[] = [
    { icon: Home, label: t('nav.home'), href: '/' },
    { icon: BookOpen, label: t('nav.courses'), href: '/courses' },
    { icon: FileText, label: t('nav.summaries'), href: '/summaries' },
    { icon: Layers, label: t('nav.modules'), href: '/modules' },
    { icon: CheckCircle, label: t('nav.quiz'), href: '/quiz' },
    { icon: Library, label: t('nav.library'), href: '/library' },
    { icon: Activity, label: t('nav.cases'), href: '/cases' },
    { icon: Newspaper, label: t('nav.news'), href: '/news' },
  ];

  const specialItems: NavItem[] = [
    { icon: User, label: t('nav.profile'), href: '/profile' },
    { icon: Heart, label: t('nav.about'), href: '/a-propos-de-mimi', highlight: true },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white dark:bg-gray-900 backdrop-blur-xl shadow-lg border-b border-pink-200 dark:border-pink-900/50'
            : 'bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 dark:from-gray-800 dark:via-purple-900/40 dark:to-blue-900/40 backdrop-blur-md shadow-md'
        }`}
        style={{
          borderBottom: isScrolled ? undefined : '2px solid rgba(236, 72, 153, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
            >
              <motion.img
                src="/images/avatars/smiling.png"
                alt="Dr.MiMi Logo"
                className="h-10 w-10 rounded-full shadow-lg ring-2 ring-pink-300 dark:ring-pink-600 group-hover:ring-4 transition-all object-cover"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div className="hidden md:block">
                <div className="flex items-center gap-0.5">
                  {['D', 'r', '.', 'M', 'i', 'M', 'i'].map((letter, index) => (
                    <motion.span
                      key={index}
                      className="text-xl font-serif italic font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #60a5fa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.3))',
                      }}
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
                  {language === 'en'
                    ? 'Medical Education'
                    : language === 'ar'
                    ? 'التعليم الطبي'
                    : 'Éducation Médicale'}
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavButton key={item.href} item={item} />
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Special Items - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                {specialItems.map((item) => (
                  <NavButton key={item.href} item={item} />
                ))}
              </div>

              {/* Theme & Language */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-pink-200/50 dark:border-pink-800/50">
                <ThemeToggle />
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <LanguageSelector />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:shadow-lg transition-all"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: isRTL ? 400 : -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRTL ? 400 : -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-16 ${
                isRTL ? 'right-0' : 'left-0'
              } bottom-0 w-80 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 backdrop-blur-xl shadow-2xl z-40 overflow-y-auto lg:hidden border-r-4 border-pink-300 dark:border-pink-700`}
            >
              <div className="p-6 space-y-6">
                {/* Dr. MiMi Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-400/20 to-purple-400/20 border-2 border-pink-300/30 dark:border-pink-600/30"
                >
                  <img
                    src="/images/avatars/greeting.png"
                    alt="Dr. MiMi"
                    className="w-16 h-16 rounded-full shadow-xl ring-4 ring-white/50"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {language === 'en'
                        ? 'Welcome!'
                        : language === 'ar'
                        ? 'مرحباً!'
                        : 'Bienvenue!'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dr. MiMi 💕
                    </p>
                  </div>
                </motion.div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                    {language === 'en' ? 'Navigation' : language === 'ar' ? 'التنقل' : 'Navigation'}
                  </h4>
                  {navItems.map((item, index) => (
                    <MobileNavItem key={item.href} item={item} index={index} />
                  ))}
                </div>

                {/* Special Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                    {language === 'en' ? 'More' : language === 'ar' ? 'المزيد' : 'Plus'}
                  </h4>
                  {specialItems.map((item, index) => (
                    <MobileNavItem key={item.href} item={item} index={index + navItems.length} />
                  ))}
                </div>

                {/* Sparkle Decoration */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Made with 💕
                  </span>
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

// Desktop Nav Button
const NavButton: React.FC<{ item: NavItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const Icon = item.icon;

  return (
    <Link to={item.href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
          isActive
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
            : item.highlight
            ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white hover:shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive || item.highlight ? 'animate-pulse' : ''}`} />
        <span className="text-sm whitespace-nowrap">{item.label}</span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-xl border-2 border-white/30"
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

// Mobile Nav Item
const MobileNavItem: React.FC<{ item: NavItem; index: number }> = ({ item, index }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const Icon = item.icon;

  return (
    <Link to={item.href}>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
          isActive
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
            : item.highlight
            ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white hover:shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60'
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            isActive || item.highlight
              ? 'bg-white/20'
              : 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex-1">{item.label}</span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        )}
      </motion.div>
    </Link>
  );
};

export default ModernNavbar;
