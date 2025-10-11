// Drizzle schema for MediMimi medical education platform
// Based on the specification from attached_assets/Pasted--schema-version-1-0...
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - Extended for MediMimi with medical student features and RBAC
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: varchar("username").unique(), // For owner authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  university: varchar("university"),
  country: varchar("country"),
  // Updated to use only the 5 main roles as per requirements
  role: varchar("role", { enum: ["owner", "admin", "editor", "viewer", "consultant"] }).default("viewer"),
  customPermissions: jsonb("custom_permissions"), // For any custom permission overrides
  locale: varchar("locale", { length: 10 }).default("fr"),
  yearOfStudy: varchar("year_of_study", { enum: ["Y1","Y2","Y3","Y4","Y5","Y6","Intern"] }),
  isBlacklisted: boolean("is_blacklisted").default(false),
  blacklistReason: text("blacklist_reason"),
  password: varchar("password"), // For non-OAuth users like owner
  forcePasswordChange: boolean("force_password_change").default(false),
  lastLoginAt: timestamp("last_login_at"),
  sessionTimeout: integer("session_timeout").default(3600), // seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical modules (anatomy, cardiology, etc.)
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey(), // e.g., "anatomy", "cardiology"
  name: varchar("name").notNull(),
  nameEn: varchar("name_en"),
  nameAr: varchar("name_ar"),
  category: varchar("category", { enum: ["Preclinical", "Clinical", "PublicHealth"] }).notNull(),
  bodySystems: jsonb("body_systems"), // array of strings
  icon: varchar("icon"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses (structured lessons)
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  content: text("content"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  moduleId: varchar("module_id").references(() => modules.id),
  yearLevels: jsonb("year_levels"), // array of year levels
  authors: jsonb("authors"), // array of author names
  language: varchar("language", { length: 10 }).default("fr"),
  coverImage: varchar("cover_image"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons within courses
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: uuid("course_id").references(() => courses.id),
  title: varchar("title").notNull(),
  content: text("content"), // rich text/markdown
  orderIndex: integer("order_index"),
  images: jsonb("images"), // array of image URLs
  videos: jsonb("videos"), // array of video URLs
  biodigitalLinks: jsonb("biodigital_links"), // array of BioDigital links
  createdAt: timestamp("created_at").defaultNow(),
});

// Summaries (PDF documents)
export const summaries = pgTable("summaries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  content: text("content"),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  moduleId: varchar("module_id").references(() => modules.id),
  pdfAsset: varchar("pdf_asset"),
  previewImages: jsonb("preview_images"), // array of preview image URLs
  language: varchar("language", { length: 10 }).default("fr"),
  pages: integer("pages"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  tags: jsonb("tags"), // array of tags
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  moduleId: varchar("module_id").references(() => modules.id),
  timeLimitSec: integer("time_limit_sec"),
  difficulty: varchar("difficulty", { enum: ["Easy", "Medium", "Hard"] }).default("Medium"),
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz questions
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  stem: text("stem"), // markdown question text
  stemEn: text("stem_en"),
  stemAr: text("stem_ar"),
  type: varchar("type", { enum: ["MCQ", "EMQ", "TrueFalse", "ShortAnswer", "CaseBased"] }),
  answerExplanation: text("answer_explanation"),
  answerExplanationEn: text("answer_explanation_en"),
  answerExplanationAr: text("answer_explanation_ar"),
  reference: varchar("reference"),
  orderIndex: integer("order_index"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Answer options for questions
export const options = pgTable("options", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: uuid("question_id").references(() => questions.id),
  label: varchar("label").notNull(),
  labelEn: varchar("label_en"),
  labelAr: varchar("label_ar"),
  isCorrect: boolean("is_correct").default(false),
  orderIndex: integer("order_index"),
});

// Clinical cases
export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  presentation: text("presentation"),
  presentationEn: text("presentation_en"),
  presentationAr: text("presentation_ar"),
  history: text("history"),
  historyEn: text("history_en"),
  historyAr: text("history_ar"),
  exam: text("exam"),
  examEn: text("exam_en"),
  examAr: text("exam_ar"),
  investigations: text("investigations"),
  investigationsEn: text("investigations_en"),
  investigationsAr: text("investigations_ar"),
  management: text("management"),
  managementEn: text("management_en"),
  managementAr: text("management_ar"),
  moduleId: varchar("module_id").references(() => modules.id),
  difficulty: varchar("difficulty"),
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// News items
export const newsItems = pgTable("news_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  source: varchar("source"),
  link: varchar("link"),
  summary: text("summary"),
  tags: jsonb("tags"),
  publishedAt: timestamp("published_at"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog posts for admin content creation
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  slug: varchar("slug").unique(),
  content: text("content").notNull(), // Rich text/HTML content
  excerpt: text("excerpt"), // Short summary for preview
  category: varchar("category", { enum: ["Actualités", "Conseils", "Études", "Carrière", "Innovation"] }),
  coverImage: varchar("cover_image"),
  images: jsonb("images"), // array of image URLs used in content
  tags: jsonb("tags"), // array of tags
  readingTime: integer("reading_time"), // estimated minutes to read
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  featured: boolean("featured").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("19.00"),
  isPremium: boolean("is_premium").default(false),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  publishedAt: timestamp("published_at"),
  createdBy: varchar("created_by").references(() => users.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog post versions for versioning/history
export const blogPostVersions = pgTable("blog_post_versions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => blogPosts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  changedBy: varchar("changed_by").references(() => users.id),
  changeReason: text("change_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CMS Articles table for TipTap editor content
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  slug: varchar("slug").unique().notNull(),
  content: jsonb("content").notNull(), // TipTap JSON content
  contentEn: jsonb("content_en"), // English version
  contentAr: jsonb("content_ar"), // Arabic version
  metaDescription: text("meta_description"),
  metaDescriptionEn: text("meta_description_en"),
  metaDescriptionAr: text("meta_description_ar"),
  featuredImage: varchar("featured_image"),
  priceDzd: decimal("price_dzd", { precision: 10, scale: 2 }).default("0"),
  priceEur: decimal("price_eur", { precision: 10, scale: 2 }).default("0"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("19.00"),
  isPaid: boolean("is_paid").default(false),
  status: varchar("status", { enum: ["draft", "published", "archived"] }).default("draft"),
  translationStatus: varchar("translation_status", { enum: ["complete", "needs_review", "in_progress"] }).default("in_progress"),
  moduleId: varchar("module_id").references(() => modules.id),
  tags: jsonb("tags"), // array of tags
  yearLevels: jsonb("year_levels"), // array of year levels
  readingTime: integer("reading_time"), // estimated minutes to read
  viewCount: integer("view_count").default(0),
  authorId: varchar("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Article versions for version history
export const articleVersions = pgTable("article_versions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  title: varchar("title").notNull(),
  content: jsonb("content").notNull(), // TipTap JSON content
  metaDescription: text("meta_description"),
  changedBy: varchar("changed_by").references(() => users.id),
  changeReason: text("change_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Article templates for reusable content structures
export const articleTemplates = pgTable("article_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category", { enum: ["Course", "ClinicalCase", "RevisionSheet", "Quiz", "Custom"] }).default("Custom"),
  content: jsonb("content").notNull(), // TipTap JSON template
  thumbnail: varchar("thumbnail"),
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchases
export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  itemType: varchar("item_type", { enum: ["Course", "Summary", "Bundle"] }),
  itemId: varchar("item_id"),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  status: varchar("status", { enum: ["paid", "pending", "failed"] }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments system
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type"), // "course", "summary", "case", etc.
  entityId: varchar("entity_id"),
  userId: varchar("user_id").references(() => users.id),
  body: text("body").notNull(),
  status: varchar("status", { enum: ["visible", "hidden", "pending"] }).default("visible"),
  parentId: uuid("parent_id").references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blacklist entries
export const blacklistEntries = pgTable("blacklist_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  reason: text("reason"),
  scope: varchar("scope", { enum: ["comments", "chat", "site"] }).default("comments"),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media assets
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name"),
  mimetype: varchar("mimetype"),
  size: integer("size"),
  url: varchar("url"),
  thumbnailUrl: varchar("thumbnail_url"),
  status: varchar("status", { enum: ["scanning", "approved", "rejected"] }).default("scanning"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings (theme, preferences)
export const userSettings = pgTable("user_settings", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  theme: varchar("theme", { enum: ["light", "dark", "feminine_light", "feminine_dark"] }).default("light"),
  locale: varchar("locale", { length: 10 }).default("fr"),
  rtlPreference: boolean("rtl_preference").default(false),
  reducedMotion: boolean("reduced_motion").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit logs for tracking admin actions - RBAC security
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userRole: varchar("user_role").notNull(), // role at time of action
  action: varchar("action").notNull(), // e.g., "user.update", "article.delete"
  entityType: varchar("entity_type"), // e.g., "user", "article", "settings"
  entityId: varchar("entity_id"), // ID of the affected entity
  oldValues: jsonb("old_values"), // Previous state
  newValues: jsonb("new_values"), // New state
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Additional context
  severity: varchar("severity", { enum: ["info", "warning", "critical"] }).default("info"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_audit_logs_user").on(table.userId),
  index("idx_audit_logs_action").on(table.action),
  index("idx_audit_logs_entity").on(table.entityType, table.entityId),
  index("idx_audit_logs_created").on(table.createdAt),
]);

// Analytics - Site visitors tracking
export const siteVisitors = pgTable("site_visitors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").references(() => users.id), // null for anonymous
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  country: varchar("country"),
  city: varchar("city"),
  referrer: varchar("referrer"),
  landingPage: varchar("landing_page"),
  pagesVisited: jsonb("pages_visited"), // array of page paths
  timeSpent: integer("time_spent"), // seconds
  deviceType: varchar("device_type", { enum: ["desktop", "mobile", "tablet"] }),
  isReturning: boolean("is_returning").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics - Page views
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(), // Just a string, no foreign key
  userId: varchar("user_id").references(() => users.id),
  path: varchar("path").notNull(),
  title: varchar("title"),
  timeSpent: integer("time_spent"), // seconds on page
  scrollDepth: integer("scroll_depth"), // percentage
  exitPage: boolean("exit_page").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics - Revenue tracking
export const revenueReports = pgTable("revenue_reports", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  periodType: varchar("period_type", { enum: ["daily", "weekly", "monthly", "yearly"] }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).notNull(),
  courseRevenue: decimal("course_revenue", { precision: 12, scale: 2 }).default("0"),
  summaryRevenue: decimal("summary_revenue", { precision: 12, scale: 2 }).default("0"),
  bundleRevenue: decimal("bundle_revenue", { precision: 12, scale: 2 }).default("0"),
  transactionCount: integer("transaction_count").default(0),
  newCustomers: integer("new_customers").default(0),
  returningCustomers: integer("returning_customers").default(0),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team management
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  position: varchar("position").notNull(), // "Fondatrice", "Éditeur Médical", etc.
  department: varchar("department"), // "Administration", "Contenu", "Technique"
  permissions: jsonb("permissions"), // array of permission strings
  salary: decimal("salary", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  hireDate: timestamp("hire_date").defaultNow(),
  status: varchar("status", { enum: ["active", "inactive", "suspended"] }).default("active"),
  supervisorId: varchar("supervisor_id").references(() => users.id),
  bio: text("bio"),
  skills: jsonb("skills"), // array of skill strings
  achievements: jsonb("achievements"), // array of achievement objects
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Google Drive file uploads with pricing
export const driveFiles = pgTable("drive_files", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  driveUrl: varchar("drive_url").notNull(), // Google Drive sharing link
  downloadUrl: varchar("download_url"), // Direct download link
  fileType: varchar("file_type", { enum: ["pdf", "docx", "pptx", "video", "image"] }),
  fileSize: varchar("file_size"), // "2.5 MB"
  moduleId: varchar("module_id").references(() => modules.id),
  category: varchar("category"), // "Cours", "Résumé", "Exercices"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  isFree: boolean("is_free").default(false),
  downloadCount: integer("download_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  tags: jsonb("tags"), // array of tags
  previewImages: jsonb("preview_images"), // array of preview image URLs
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Download tracking for monetization
export const fileDownloads = pgTable("file_downloads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fileId: uuid("file_id").references(() => driveFiles.id),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"),
  downloadType: varchar("download_type", { enum: ["purchase", "free", "preview"] }),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site settings - Store logo, fonts, branding
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").unique().notNull(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { enum: ["image", "font", "text", "color", "json"] }).notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content submissions - Approval workflow
export const contentSubmissions = pgTable("content_submissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: varchar("content_type", { enum: ["article", "post", "blog", "course", "case", "file", "image"] }).notNull(),
  contentId: varchar("content_id").notNull(),
  submittedBy: varchar("submitted_by").references(() => users.id).notNull(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Support tickets - Admin support system
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open").notNull(),
  priority: varchar("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  messages: jsonb("messages"), // array of {senderId, message, timestamp}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics snapshots - Daily aggregated analytics
export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  snapshotDate: timestamp("snapshot_date").notNull().unique(),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  totalTransactions: integer("total_transactions").default(0),
  newUsers: integer("new_users").default(0),
  activeUsers: integer("active_users").default(0),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  articlesPublished: integer("articles_published").default(0),
  articlesSold: integer("articles_sold").default(0),
  avgSessionDuration: integer("avg_session_duration").default(0), // seconds
  topPages: jsonb("top_pages"), // array of {page, views}
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics events - Raw event tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: varchar("event_type").notNull(), // "page_view", "purchase", "signup", "article_view"
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  metadata: jsonb("metadata"), // event-specific data
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User blacklist audit - Blacklist history
export const userBlacklistAudit = pgTable("user_blacklist_audit", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action", { enum: ["blacklisted", "unblacklisted"] }).notNull(),
  reason: text("reason"),
  performedBy: varchar("performed_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts - Social-style posts
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  content: text("content").notNull(),
  contentEn: text("content_en"),
  contentAr: text("content_ar"),
  images: jsonb("images"), // array of image URLs
  postType: varchar("post_type", { enum: ["announcement", "tip", "news", "discussion"] }).default("announcement").notNull(),
  isPinned: boolean("is_pinned").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  status: varchar("status", { enum: ["draft", "review", "published", "archived"] }).default("draft").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events - Educational events
export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  titleEn: varchar("title_en"),
  titleAr: varchar("title_ar"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  eventType: varchar("event_type", { enum: ["webinar", "workshop", "conference", "exam"] }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location"),
  isOnline: boolean("is_online").default(true),
  meetingLink: varchar("meeting_link"),
  maxParticipants: integer("max_participants"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("DZD"),
  coverImage: varchar("cover_image"),
  status: varchar("status", { enum: ["draft", "review", "published", "cancelled"] }).default("draft").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course enrollments - Track user course progress
export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  status: varchar("status", { enum: ["enrolled", "completed", "dropped"] }).default("enrolled"),
  progress: integer("progress").default(0), // 0-100%
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz attempts - Track quiz performance
export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  quizId: uuid("quiz_id").references(() => quizzes.id),
  score: integer("score"), // percentage 0-100
  passed: boolean("passed").default(false),
  timeTaken: integer("time_taken_sec"),
  answers: jsonb("answers"), // { questionId: answer }
  createdAt: timestamp("created_at").defaultNow(),
});

// Case completions - Track clinical case solving
export const caseCompletions = pgTable("case_completions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  caseId: uuid("case_id").references(() => cases.id),
  solved: boolean("solved").default(false),
  timeSpent: integer("time_spent_sec"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Summary downloads - Track summary access
export const summaryDownloads = pgTable("summary_downloads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  summaryId: uuid("summary_id").references(() => summaries.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges - Achievement system
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  badgeType: varchar("badge_type", { enum: ["gold", "silver", "bronze"] }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  summaries: many(summaries),
  quizzes: many(quizzes),
  cases: many(cases),
  purchases: many(purchases),
  comments: many(comments),
  blogPosts: many(blogPosts),
  uploads: many(mediaAssets),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  courses: many(courses),
  summaries: many(summaries),
  quizzes: many(quizzes),
  cases: many(cases),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  module: one(modules, { fields: [courses.moduleId], references: [modules.id] }),
  creator: one(users, { fields: [courses.createdBy], references: [users.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, { fields: [lessons.courseId], references: [courses.id] }),
}));

export const summariesRelations = relations(summaries, ({ one }) => ({
  module: one(modules, { fields: [summaries.moduleId], references: [modules.id] }),
  creator: one(users, { fields: [summaries.createdBy], references: [users.id] }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  module: one(modules, { fields: [quizzes.moduleId], references: [modules.id] }),
  creator: one(users, { fields: [quizzes.createdBy], references: [users.id] }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, { fields: [options.questionId], references: [questions.id] }),
}));

export const casesRelations = relations(cases, ({ one }) => ({
  module: one(modules, { fields: [cases.moduleId], references: [modules.id] }),
  creator: one(users, { fields: [cases.createdBy], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  replies: many(comments),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
}));

export const siteVisitorsRelations = relations(siteVisitors, ({ one, many }) => ({
  user: one(users, { fields: [siteVisitors.userId], references: [users.id] }),
  pageViews: many(pageViews),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  user: one(users, { fields: [pageViews.userId], references: [users.id] }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  supervisor: one(users, { fields: [teamMembers.supervisorId], references: [users.id] }),
  creator: one(users, { fields: [teamMembers.createdBy], references: [users.id] }),
}));

export const driveFilesRelations = relations(driveFiles, ({ one, many }) => ({
  module: one(modules, { fields: [driveFiles.moduleId], references: [modules.id] }),
  creator: one(users, { fields: [driveFiles.createdBy], references: [users.id] }),
  downloads: many(fileDownloads),
}));

export const fileDownloadsRelations = relations(fileDownloads, ({ one }) => ({
  file: one(driveFiles, { fields: [fileDownloads.fileId], references: [driveFiles.id] }),
  user: one(users, { fields: [fileDownloads.userId], references: [users.id] }),
}));

// Contracts - System for agreements between roles (Owner-Admin, Admin-Editor, etc.)
export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(), // e.g., "Contrat Owner-Admin 2025"
  contractType: varchar("contract_type", { 
    enum: ["owner_admin", "admin_editor", "editor_consultant", "custom"] 
  }).notNull(),
  // Parties involved
  partyAId: varchar("party_a_id").references(() => users.id).notNull(), // e.g., Owner
  partyARole: varchar("party_a_role", { enum: ["owner", "admin", "editor", "viewer", "consultant"] }).notNull(),
  partyBId: varchar("party_b_id").references(() => users.id).notNull(), // e.g., Admin
  partyBRole: varchar("party_b_role", { enum: ["owner", "admin", "editor", "viewer", "consultant"] }).notNull(),
  // Financial terms
  revenueSharePercentageA: decimal("revenue_share_percentage_a", { precision: 5, scale: 2 }), // Party A percentage
  revenueSharePercentageB: decimal("revenue_share_percentage_b", { precision: 5, scale: 2 }), // Party B percentage
  fixedPayment: decimal("fixed_payment", { precision: 10, scale: 2 }), // Optional fixed payment
  currency: varchar("currency", { length: 3 }).default("DZD"),
  paymentFrequency: varchar("payment_frequency", { 
    enum: ["monthly", "quarterly", "annual", "per_sale", "one_time"] 
  }),
  // Contract details
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // null = indefinite
  autoRenew: boolean("auto_renew").default(false),
  // Status and signatures
  status: varchar("status", { 
    enum: ["draft", "pending_signature_a", "pending_signature_b", "active", "expired", "terminated"] 
  }).default("draft"),
  signedByAAt: timestamp("signed_by_a_at"),
  signedByBAt: timestamp("signed_by_b_at"),
  terminationReason: text("termination_reason"),
  terminatedAt: timestamp("terminated_at"),
  // Metadata
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contract Clauses - Detailed clauses for each contract
export const contractClauses = pgTable("contract_clauses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  clauseNumber: varchar("clause_number").notNull(), // e.g., "1.1", "2.3"
  title: varchar("title").notNull(), // e.g., "Obligations de l'Administrateur"
  content: text("content").notNull(), // Detailed clause text
  clauseType: varchar("clause_type", { 
    enum: ["financial", "responsibilities", "confidentiality", "termination", "liability", "other"] 
  }).default("other"),
  isMandatory: boolean("is_mandatory").default(true),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contract Signatures - Electronic signatures for contracts
export const contractSignatures = pgTable("contract_signatures", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userRole: varchar("user_role", { enum: ["owner", "admin", "editor", "viewer", "consultant"] }).notNull(),
  signatureType: varchar("signature_type", { 
    enum: ["electronic", "digital_certificate", "manual_upload"] 
  }).default("electronic"),
  signatureData: text("signature_data"), // Base64 signature image or certificate data
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  consentText: text("consent_text"), // The text user agreed to
  signedAt: timestamp("signed_at").defaultNow(),
});

// Relations for contracts
export const contractsRelations = relations(contracts, ({ one, many }) => ({
  partyA: one(users, { fields: [contracts.partyAId], references: [users.id] }),
  partyB: one(users, { fields: [contracts.partyBId], references: [users.id] }),
  creator: one(users, { fields: [contracts.createdBy], references: [users.id] }),
  clauses: many(contractClauses),
  signatures: many(contractSignatures),
}));

export const contractClausesRelations = relations(contractClauses, ({ one }) => ({
  contract: one(contracts, { fields: [contractClauses.contractId], references: [contracts.id] }),
}));

export const contractSignaturesRelations = relations(contractSignatures, ({ one }) => ({
  contract: one(contracts, { fields: [contractSignatures.contractId], references: [contracts.id] }),
  user: one(users, { fields: [contractSignatures.userId], references: [users.id] }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;
export type Summary = typeof summaries.$inferSelect;
export type InsertSummary = typeof summaries.$inferInsert;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;
export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type ArticleVersion = typeof articleVersions.$inferSelect;
export type InsertArticleVersion = typeof articleVersions.$inferInsert;
export type ArticleTemplate = typeof articleTemplates.$inferSelect;
export type InsertArticleTemplate = typeof articleTemplates.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type SiteVisitor = typeof siteVisitors.$inferSelect;
export type InsertSiteVisitor = typeof siteVisitors.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;
export type RevenueReport = typeof revenueReports.$inferSelect;
export type InsertRevenueReport = typeof revenueReports.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type DriveFile = typeof driveFiles.$inferSelect;
export type InsertDriveFile = typeof driveFiles.$inferInsert;
export type FileDownload = typeof fileDownloads.$inferSelect;
export type InsertFileDownload = typeof fileDownloads.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;
export type ContractClause = typeof contractClauses.$inferSelect;
export type InsertContractClause = typeof contractClauses.$inferInsert;
export type ContractSignature = typeof contractSignatures.$inferSelect;
export type InsertContractSignature = typeof contractSignatures.$inferInsert;

// Tracking tables type exports
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;
export type CaseCompletion = typeof caseCompletions.$inferSelect;
export type InsertCaseCompletion = typeof caseCompletions.$inferInsert;
export type SummaryDownload = typeof summaryDownloads.$inferSelect;
export type InsertSummaryDownload = typeof summaryDownloads.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;