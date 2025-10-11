// Page d'inscription utilisateur pour Dr.MiMi
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, GraduationCap, Eye, EyeOff, 
  Check, X, Loader, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMedicalEmojis } from '../contexts/ThemeContext';
import SocialLoginButtons from '../components/SocialLoginButtons';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  yearOfStudy: string;
  acceptTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const emojis = useMedicalEmojis();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    yearOfStudy: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Password strength validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isStrong: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    };
  };

  const passwordStrength = validatePassword(formData.password);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'en' ? 'First name is required' : language === 'ar' ? 'الاسم الأول مطلوب' : 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'en' ? 'Last name is required' : language === 'ar' ? 'اسم العائلة مطلوب' : 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? 'Email is required' : language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Invalid email format' : language === 'ar' ? 'تنسيق البريد الإلكتروني غير صالح' : 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = language === 'en' ? 'Password is required' : language === 'ar' ? 'كلمة المرور مطلوبة' : 'Le mot de passe est requis';
    } else if (!passwordStrength.isStrong) {
      newErrors.password = language === 'en' ? 'Password is not strong enough' : language === 'ar' ? 'كلمة المرور ليست قوية بما فيه الكفاية' : 'Le mot de passe n\'est pas assez fort';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = language === 'en' ? 'Please confirm your password' : language === 'ar' ? 'يرجى تأكيد كلمة المرور' : 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'en' ? 'Passwords do not match' : language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas';
    }

    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = language === 'en' ? 'Year of study is required' : language === 'ar' ? 'سنة الدراسة مطلوبة' : 'L\'année d\'étude est requise';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = language === 'en' ? 'You must accept the terms' : language === 'ar' ? 'يجب عليك قبول الشروط' : 'Vous devez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          yearOfStudy: formData.yearOfStudy,
          locale: language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || (language === 'en' ? 'Registration failed' : language === 'ar' ? 'فشل التسجيل' : 'L\'inscription a échoué'));
        setIsLoading(false);
        return;
      }

      // Inscription réussie
      alert(language === 'en' ? 'Registration successful! Please log in.' : language === 'ar' ? 'التسجيل ناجح! يرجى تسجيل الدخول.' : 'Inscription réussie ! Veuillez vous connecter.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(language === 'en' ? 'Server error. Please try again.' : language === 'ar' ? 'خطأ في الخادم. يرجى المحاولة مرة أخرى.' : 'Erreur serveur. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  const yearOptions = [
    { value: 'Y1', label: language === 'en' ? '1st Year (PACES)' : language === 'ar' ? 'السنة الأولى (PACES)' : '1ère Année (PACES)' },
    { value: 'Y2', label: language === 'en' ? '2nd Year (DFGSM 2)' : language === 'ar' ? 'السنة الثانية (DFGSM 2)' : '2ème Année (DFGSM 2)' },
    { value: 'Y3', label: language === 'en' ? '3rd Year (DFGSM 3)' : language === 'ar' ? 'السنة الثالثة (DFGSM 3)' : '3ème Année (DFGSM 3)' },
    { value: 'Y4', label: language === 'en' ? '4th Year (DFASM 1)' : language === 'ar' ? 'السنة الرابعة (DFASM 1)' : '4ème Année (DFASM 1)' },
    { value: 'Y5', label: language === 'en' ? '5th Year (DFASM 2)' : language === 'ar' ? 'السنة الخامسة (DFASM 2)' : '5ème Année (DFASM 2)' },
    { value: 'Y6', label: language === 'en' ? '6th Year (DFASM 3)' : language === 'ar' ? 'السنة السادسة (DFASM 3)' : '6ème Année (DFASM 3)' },
    { value: 'Intern', label: language === 'en' ? 'Intern' : language === 'ar' ? 'متدرب' : 'Interne' }
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        className="w-full max-w-2xl p-8 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full mb-4"
               style={{ backgroundColor: 'var(--color-primary-light)' }}>
            <User size={40} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {language === 'en' ? 'Join Dr. MiMi' : language === 'ar' ? 'انضم إلى Dr. MiMi' : 'Rejoindre Dr. MiMi'} {emojis.stethoscope}
          </h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {language === 'en' 
              ? 'Create your account and start your medical journey'
              : language === 'ar'
              ? 'أنشئ حسابك وابدأ رحلتك الطبية'
              : 'Créez votre compte et commencez votre parcours médical'}
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <motion.div
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={20} style={{ color: '#EF4444' }} />
            <span style={{ color: '#991B1B' }}>{serverError}</span>
          </motion.div>
        )}

        {/* Social Login Buttons */}
        <div className="mb-6">
          <SocialLoginButtons mode="register" />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-textSecondary)' }}>
              {language === 'en' ? 'Or register with email' : language === 'ar' ? 'أو سجل بالبريد الإلكتروني' : 'Ou inscrivez-vous avec email'}
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                {language === 'en' ? 'First Name' : language === 'ar' ? 'الاسم الأول' : 'Prénom'} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: errors.firstName ? '#EF4444' : 'var(--color-border)',
                    color: 'var(--color-text)',
                    borderWidth: errors.firstName ? '2px' : '1px'
                  }}
                  placeholder={language === 'en' ? 'Merieme' : language === 'ar' ? 'مريم' : 'Merieme'}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                {language === 'en' ? 'Last Name' : language === 'ar' ? 'اسم العائلة' : 'Nom'} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: errors.lastName ? '#EF4444' : 'var(--color-border)',
                    color: 'var(--color-text)',
                    borderWidth: errors.lastName ? '2px' : '1px'
                  }}
                  placeholder={language === 'en' ? 'BENNAMANE' : language === 'ar' ? 'بن نعمان' : 'BENNAMANE'}
                />
              </div>
              {errors.lastName && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.lastName}</p>}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'Email Address' : language === 'ar' ? 'عنوان البريد الإلكتروني' : 'Adresse Email'} *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: errors.email ? '#EF4444' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  borderWidth: errors.email ? '2px' : '1px'
                }}
                placeholder={language === 'en' ? 'merieme@example.com' : language === 'ar' ? 'merieme@example.com' : 'merieme@example.com'}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.email}</p>}
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'Year of Study' : language === 'ar' ? 'سنة الدراسة' : 'Année d\'Étude'} *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: errors.yearOfStudy ? '#EF4444' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  borderWidth: errors.yearOfStudy ? '2px' : '1px'
                }}
              >
                <option value="">{language === 'en' ? 'Select your year' : language === 'ar' ? 'اختر سنتك' : 'Sélectionnez votre année'}</option>
                {yearOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {errors.yearOfStudy && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.yearOfStudy}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'Password' : language === 'ar' ? 'كلمة المرور' : 'Mot de Passe'} *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: errors.password ? '#EF4444' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  borderWidth: errors.password ? '2px' : '1px'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: 'var(--color-textSecondary)' }} />
                ) : (
                  <Eye size={20} style={{ color: 'var(--color-textSecondary)' }} />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.password}</p>}

            {/* Password Strength Indicators */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  {passwordStrength.minLength ? 
                    <Check size={16} style={{ color: '#10B981' }} /> : 
                    <X size={16} style={{ color: '#EF4444' }} />
                  }
                  <span className="text-sm" style={{ color: passwordStrength.minLength ? '#10B981' : 'var(--color-textSecondary)' }}>
                    {language === 'en' ? '8 characters minimum' : language === 'ar' ? '8 أحرف على الأقل' : '8 caractères minimum'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordStrength.hasUpperCase ? 
                    <Check size={16} style={{ color: '#10B981' }} /> : 
                    <X size={16} style={{ color: '#EF4444' }} />
                  }
                  <span className="text-sm" style={{ color: passwordStrength.hasUpperCase ? '#10B981' : 'var(--color-textSecondary)' }}>
                    {language === 'en' ? 'One uppercase letter' : language === 'ar' ? 'حرف كبير واحد' : 'Une lettre majuscule'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordStrength.hasNumber ? 
                    <Check size={16} style={{ color: '#10B981' }} /> : 
                    <X size={16} style={{ color: '#EF4444' }} />
                  }
                  <span className="text-sm" style={{ color: passwordStrength.hasNumber ? '#10B981' : 'var(--color-textSecondary)' }}>
                    {language === 'en' ? 'One number' : language === 'ar' ? 'رقم واحد' : 'Un chiffre'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordStrength.hasSpecialChar ? 
                    <Check size={16} style={{ color: '#10B981' }} /> : 
                    <X size={16} style={{ color: '#EF4444' }} />
                  }
                  <span className="text-sm" style={{ color: passwordStrength.hasSpecialChar ? '#10B981' : 'var(--color-textSecondary)' }}>
                    {language === 'en' ? 'One special character (!@#$...)' : language === 'ar' ? 'حرف خاص واحد (!@#$...)' : 'Un caractère spécial (!@#$...)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              {language === 'en' ? 'Confirm Password' : language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le Mot de Passe'} *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-textSecondary)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: errors.confirmPassword ? '#EF4444' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  borderWidth: errors.confirmPassword ? '2px' : '1px'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} style={{ color: 'var(--color-textSecondary)' }} />
                ) : (
                  <Eye size={20} style={{ color: 'var(--color-textSecondary)' }} />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm" style={{ color: '#EF4444' }}>{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="terms" className="text-sm" style={{ color: 'var(--color-text)' }}>
              {language === 'en' 
                ? 'I accept the Terms of Service and Privacy Policy'
                : language === 'ar'
                ? 'أوافق على شروط الخدمة وسياسة الخصوصية'
                : 'J\'accepte les Conditions d\'Utilisation et la Politique de Confidentialité'}
            </label>
          </div>
          {errors.acceptTerms && <p className="text-sm" style={{ color: '#EF4444' }}>{errors.acceptTerms}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
            }}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                {language === 'en' ? 'Creating Account...' : language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Création du Compte...'}
              </>
            ) : (
              <>
                {language === 'en' ? 'Create Account' : language === 'ar' ? 'إنشاء حساب' : 'Créer un Compte'}
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {language === 'en' ? 'Already have an account?' : language === 'ar' ? 'هل لديك حساب بالفعل؟' : 'Vous avez déjà un compte ?'}{' '}
              <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                {language === 'en' ? 'Sign In' : language === 'ar' ? 'تسجيل الدخول' : 'Se Connecter'}
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
