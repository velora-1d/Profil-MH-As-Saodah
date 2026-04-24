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
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  group: text('group').notNull().default('umum'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// HERO SLIDES
// ============================================================

export const webHeroes = pgTable('cms_web_heroes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  mediaType: text('media_type').notNull().default('image'),
  mediaUrl: text('media_url').notNull(),
  ctaText: text('cta_text'),
  ctaUrl: text('cta_url'),
  order: integer('order').notNull().default(0),
  status: text('status').notNull().default('aktif'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// FASILITAS
// ============================================================

export const webFacilities = pgTable('cms_web_facilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  iconSvg: text('icon_svg'),
  order: integer('order').notNull().default(0),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// PRESTASI
// ============================================================

export const webAchievements = pgTable('cms_web_achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  studentName: text('student_name'),
  competitionName: text('competition_name'),
  level: text('level').notNull().default('kabupaten'),
  year: integer('year').notNull(),
  imageUrl: text('image_url'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('web_achievements_level_idx').on(t.level),
  index('web_achievements_year_idx').on(t.year),
]);

// ============================================================
// BERITA / POSTS
// ============================================================

export const webPosts = pgTable('cms_web_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').notNull().default('berita'),
  status: text('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('web_posts_slug_idx').on(t.slug),
  index('web_posts_status_idx').on(t.status),
]);

// ============================================================
// GURU / TEACHERS
// ============================================================

export const webTeachers = pgTable('cms_web_teachers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position'),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  order: integer('order').notNull().default(0),
  status: text('status').notNull().default('aktif'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const webPrograms = pgTable('cms_web_programs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('BookOpen'),
  color: text('color').notNull().default('from-emerald-500 to-teal-600'),
  order: integer('order').notNull().default(0),
  status: text('status').notNull().default('aktif'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const webStats = pgTable('cms_web_stats', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  value: integer('value').notNull().default(0),
  suffix: text('suffix').notNull().default('+'),
  iconName: text('icon_name').notNull().default('Trophy'),
  color: text('color').notNull().default('from-amber-500 to-orange-600'),
  order: integer('order').notNull().default(0),
  status: text('status').notNull().default('aktif'),
  unitId: text('unit_id').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
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
