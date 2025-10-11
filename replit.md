# Dr.MiMi - Plateforme d'Éducation Médicale

## Overview
Dr.MiMi is a comprehensive medical education platform for French-speaking medical students. It offers courses, summaries, quizzes, clinical cases, a modern CMS, and a professional RBAC system with a unique, feminine design. The platform aims to be an educational toolkit, blending structured content with interactive learning, while providing advanced content management and role-based access. It includes full i18n support (FR/EN/AR), 5 RBAC roles, 15+ animated avatars, and an advanced administration system.

## User Preferences
- **Language**: French (primary), English, Arabic with RTL
- **Design**: Medical-themed magical feminine interface
- **Content**: Educational focus with structured medical modules
- **Audience**: Medical students, residents, and pre-med students
- **Monetization**: Hybrid free/paid content with DZD/EUR support

## System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom brand colors
- **Editor**: TipTap v2 with 22 extensions
- **i18n**: i18next + react-i18next (FR/EN/AR)
- **Routing**: React Router v6
- **Database**: PostgreSQL (Replit built-in) + Drizzle ORM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: Inter (display/text), JetBrains Mono (code)

### UI/UX Decisions
- **Design Theme**: Medical-themed magical feminine interface.
- **Avatars**: 15+ animated Dr. Mimi avatars in various poses.
- **Animations**: Fluid animations with cubic-bezier transitions, daily carousel, interactive MimiAnimated.
- **Color Scheme**: Primary Teal (#0FA3B1), Secondary Blue (#1363DF), Accent Amber (#F59E0B), Neutral Dark Blue (#0B132B).
- **Typography**: Inter for display/text, JetBrains Mono for code.
- **Modern Navbar**: Responsive glass-morphism design with hamburger menu, solid background for readability, rotating logo on hover.
- **Theming**: 10 available themes, including "Jardin Rose", "Océan Médical", "Sunset Wellness", "Ramadan Lunaire" (Islamic lunar theme with gold, deep violet, night sky gradient).

### System Design Choices
- **RBAC System**: 5 hierarchical roles (Owner, Admin, Editor, Viewer, Consultant) with granular permissions.
  - **Owner**: Full control, admin management, advanced analytics.
  - **Admin**: Content and user management, support, payment validation.
  - **Editor**: Content creation/editing, submission for validation.
  - **Viewer**: Public and purchased content access, commenting.
  - **Consultant**: Availability and profile management.
- **CMS (Content Management System)**:
  - **TipTap Editor**: Block-based editor with 25+ extensions.
  - **Custom Extensions**: ImageGallery (multi-image grids), Callout (5 colored alert types), PaywallBlock (blurred preview, configurable pricing).
  - **Medical Templates**: Full Course, Detailed Clinical Case, Medical Protocol, Practical Guide.
  - **Slash Commands**: 25+ commands for quick content insertion.
  - **SEO Panel**: Meta tags, slug, SERP preview per article.
  - **Versioning**: Full article history.
  - **i18n**: FR/EN/AR tabs per article.
- **PWA (Progressive Web App)**:
  - **Offline-first Service Worker**: Smart caching strategies (Cache-first for static assets, Network-first for dynamic data).
  - **Installable**: Add to home screen for Android/iOS.
  - **Manifest**: Complete metadata for PWA functionality.
- **Owner Dashboard System**:
  - **Authentication**: Dedicated owner login at `/owner/login` with password-based auth (separate from regular user auth)
  - **Centralized Auth Helpers**: `getAuthenticatedUserId()` and `tryGetAuthenticatedUserId()` support both OAuth and session-based flows
  - **6 Main Tabs**: Overview, Analytics, Contracts, Approvals, Users, Settings
  - **Overview Tab**:
    - **KPI Cards**: Total users, active users, today visitors, today revenue
    - **Content Overview**: Articles, blog posts, courses, pending approvals count
    - **Badges Overview**: Gold/Silver/Bronze badge statistics with visual cards and totals
    - **Quick Actions**: New content, support, products, events shortcuts
  - **Analytics Tab (Financial Analytics)**:
    - **Real-time Data**: Queries actual purchases from database instead of mock data
    - **Time Range Filter**: Week/Month/Quarter/Year selection
    - **Currency Filter**: All/DZD/EUR with proper backend filtering
    - **Summary Cards**: Total revenue (DZD/EUR), total sales, paid articles count
    - **Revenue by Article Table**: Title, author, revenue, sales, owner/admin/editor shares
    - **Monthly Revenue Chart**: Bar chart with DZD/EUR breakdown
    - **Share Distribution Chart**: Pie chart showing Owner (70%), Admin (20%), Editor (10%)
    - **Revenue by Author**: Author name, article count, total share, share percentage
    - **Export Functions**: CSV and JSON export with complete financial data
  - **Contract Management**:
    - **Wizard**: 4-step visual assistant for contract creation
    - **Electronic Signatures**: Audit trail with IP, timestamp, User-Agent tracking (eIDAS/ESIGN compliant)
    - **Contract Types**: Owner↔Admin, Owner↔Editor, Admin↔Editor with customizable revenue distribution
    - **Approval Workflow**: Visual stepper with real-time tracking via WebSockets
    - **PDF Export**: Contracts with watermarks and QR codes
  - **Approvals Tab**: Review and approve/reject pending content submissions
  - **Users Tab**: User management with role filtering (all/admin/editor/viewer/consultant), blacklist management, role changes
  - **Settings Tab**: Site-wide settings management
  - **Backend APIs**:
    - `/api/admin/check`: Owner authentication verification
    - `/api/admin/badges/stats`: Badge statistics (gold/silver/bronze counts, top users)
    - `/api/admin/financial/analytics`: Financial analytics with time range and currency filtering
    - All admin routes use centralized auth helpers supporting OAuth + session flows

### Key Features
- Complete navigation with multilingual labels.
- Advanced Admin dashboard with analytics and full management capabilities.
- Enriched medical content (courses, summaries, clinical cases, quizzes).
- Light/dark theme persistence.
- Study level selector (PACES, DFGSM, DFASM).
- **User Tracking & Statistics System**:
  - **5 Tracking Tables**: course_enrollments, quiz_attempts, case_completions, summary_downloads, user_badges
  - **Real-time Statistics API** (`/api/users/stats`): Calculates user performance metrics from actual database data
  - **Profile Statistics**: Courses completed/total, quizzes passed/total, cases resolved, summaries downloaded, study hours, average score, study streak
  - **Achievement System**: Gold/silver/bronze badges with automatic tracking
  - **Progress Tracking**: Course progress (0-100%), quiz scores, case completion time
  - **Connected to ProfilePage**: Displays real user statistics fetched from database instead of mock data

## External Dependencies
- **PostgreSQL**: For database management (Replit built-in).
- **Stripe**: For EUR payments (planned for production).
- **OpenAI via Replit AI Integrations**: For Dr. Mimi AI chatbot with streaming responses (configured and operational).

## AI Chatbot System
- **Advanced Chatbot Interface**: Sophisticated chat widget replacing simple avatar bubble
  - **File Upload Support**: Images (JPEG, PNG, GIF, WEBP), Documents (PDF, DOC, DOCX), Text files (TXT)
  - **Dark/Light Mode Toggle**: Independent theme switcher within chat interface
  - **Multi-language Support**: Arabic (AR), English (EN), French (FR) with RTL support for Arabic
  - **Dr. MiMi Character**: Merieme BENNAMANE - Young Muslim medical genius, expert in all medical specialties, prophetic medicine (الطب النبوي), Islamic sciences (العلوم الشرعية), defender of Palestinian cause
  - **System Prompts**: Detailed character prompts in 3 languages with greeting "Assalamou Alykoum" and disclaimer about not replacing real doctors
  - **Streaming Responses**: Real-time AI responses using Server-Sent Events (SSE)
  - **File Management**: Upload, preview, and delete attachments before sending
  - **Responsive Design**: Minimizable window, floating avatar button when closed
  - **Backend Routes**: `/api/chat` (streaming chat), `/api/chat/upload` (file upload), `/api/chat/upload/:filename` (delete file)