import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

// ============================================================
// AUTH TABLES
// ============================================================

export const adminUsers = pgTable('cms_admin_users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text().default('admin').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// WEB SETTINGS
// ============================================================

export const webSettings = pgTable('cms_web_settings', {
  id: serial().primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value').default('').notNull(),
  settingGroup: text('setting_group').default('general').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// HERO SLIDES
// ============================================================

export const webHeroes = pgTable('cms_web_heroes', {
  id: serial().primaryKey(),
  title: text().notNull(),
  subtitle: text().default(''),
  mediaType: text('media_type').default('image').notNull(),
  mediaUrl: text('media_url').default('').notNull(),
  ctaText: text('cta_text').default(''),
  ctaUrl: text('cta_url').default(''),
  order: integer().default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// FASILITAS
// ============================================================

export const webFacilities = pgTable('cms_web_facilities', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().default(''),
  imageUrl: text('image_url').default(''),
  iconSvg: text('icon_svg').default(''),
  order: integer().default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// PRESTASI
// ============================================================

export const webAchievements = pgTable('cms_web_achievements', {
  id: serial().primaryKey(),
  title: text().notNull(),
  studentName: text('student_name').default(''),
  competitionName: text('competition_name').default(''),
  level: text().default('kecamatan').notNull(),
  year: integer().default(2025).notNull(),
  imageUrl: text('image_url').default(''),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index('cms_achievements_level_idx').on(table.level),
  index('cms_achievements_year_idx').on(table.year),
]);

// ============================================================
// BERITA / POSTS
// ============================================================

export const webPosts = pgTable('cms_web_posts', {
  id: serial().primaryKey(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text().default(''),
  content: text().default('').notNull(),
  thumbnailUrl: text('thumbnail_url').default(''),
  status: text().default('draft').notNull(),
  publishedAt: timestamp('published_at', { mode: 'string' }),
  authorId: integer('author_id'),
  metaTitle: text('meta_title').default(''),
  metaDescription: text('meta_description').default(''),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index('cms_posts_slug_idx').on(table.slug),
  index('cms_posts_status_idx').on(table.status),
  index('cms_posts_published_idx').on(table.publishedAt),
]);

// ============================================================
// GURU / TEACHERS
// ============================================================

export const webTeachers = pgTable('cms_web_teachers', {
  id: serial().primaryKey(),
  name: text().notNull(),
  position: text().default(''),
  bio: text().default(''),
  photoUrl: text('photo_url').default(''),
  order: integer().default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// PPDB SETTINGS
// ============================================================

export const ppdbSettings = pgTable('cms_ppdb_settings', {
  id: serial().primaryKey(),
  year: text().notNull(),
  isOpen: boolean('is_open').default(false).notNull(),
  quota: integer().default(0).notNull(),
  fee: text().default('').notNull(),
  startDate: text('start_date').default('').notNull(),
  endDate: text('end_date').default('').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

// ============================================================
// PPDB REGISTRATIONS
// ============================================================

export const ppdbRegistrations = pgTable('cms_ppdb_registrations', {
  id: serial().primaryKey(),
  studentName: text('student_name').notNull(),
  parentName: text('parent_name').default('').notNull(),
  phone: text().default('').notNull(),
  email: text().default(''),
  birthDate: text('birth_date').default(''),
  birthPlace: text('birth_place').default(''),
  gender: text().default('L').notNull(),
  address: text().default(''),
  previousSchool: text('previous_school').default(''),
  status: text().default('pending').notNull(),
  notes: text().default(''),
  attachments: text().default(''),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index('cms_ppdb_reg_status_idx').on(table.status),
]);
// ============================================================
// CONTACT MESSAGES
// ============================================================

export const contactMessages = pgTable('cms_contact_messages', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  subject: text().default(''),
  message: text().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index('cms_contact_messages_read_idx').on(table.isRead),
]);
