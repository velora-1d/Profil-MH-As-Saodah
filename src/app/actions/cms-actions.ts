'use server';

import { db } from '@/db';
import {
  webHeroes,
  webPosts,
  webFacilities,
  webAchievements,
  webTeachers,
  webSettings,
  ppdbSettings,
  ppdbRegistrations,
  adminUsers,
  contactMessages,
} from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ============================================================
// HERO SLIDES
// ============================================================

export async function getHeroesList() {
  return db.select().from(webHeroes).orderBy(asc(webHeroes.order));
}

export async function createHero(data: {
  title: string;
  subtitle?: string;
  mediaType?: string;
  mediaUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  order?: number;
  isActive?: boolean;
}) {
  await db.insert(webHeroes).values({
    title: data.title,
    subtitle: data.subtitle || '',
    mediaType: data.mediaType || 'image',
    mediaUrl: data.mediaUrl || '',
    ctaText: data.ctaText || '',
    ctaUrl: data.ctaUrl || '',
    order: data.order || 0,
    isActive: data.isActive ?? true,
  });
  revalidatePath('/admin/heroes');
  revalidatePath('/');
}

export async function updateHero(id: number, data: Partial<typeof webHeroes.$inferInsert>) {
  await db.update(webHeroes).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(webHeroes.id, id));
  revalidatePath('/admin/heroes');
  revalidatePath('/');
}

export async function deleteHero(id: number) {
  await db.delete(webHeroes).where(eq(webHeroes.id, id));
  revalidatePath('/admin/heroes');
  revalidatePath('/');
}

// ============================================================
// POSTS / BERITA
// ============================================================

export async function getPostsList() {
  return db.select().from(webPosts).orderBy(desc(webPosts.createdAt));
}

export async function getPostById(id: number) {
  const [post] = await db.select().from(webPosts).where(eq(webPosts.id, id)).limit(1);
  return post;
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  status?: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  await db.insert(webPosts).values({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: data.content,
    thumbnailUrl: data.thumbnailUrl || '',
    status: data.status || 'draft',
    publishedAt: data.status === 'published' ? (data.publishedAt || new Date().toISOString()) : null,
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
  });
  revalidatePath('/admin/posts');
  revalidatePath('/informasi');
}

export async function updatePost(id: number, data: Partial<typeof webPosts.$inferInsert>) {
  await db.update(webPosts).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(webPosts.id, id));
  revalidatePath('/admin/posts');
  revalidatePath('/informasi');
}

export async function deletePost(id: number) {
  await db.delete(webPosts).where(eq(webPosts.id, id));
  revalidatePath('/admin/posts');
  revalidatePath('/informasi');
}

// ============================================================
// FACILITIES / FASILITAS
// ============================================================

export async function getFacilitiesList() {
  return db.select().from(webFacilities).orderBy(asc(webFacilities.order));
}

export async function createFacility(data: {
  name: string;
  description?: string;
  imageUrl?: string;
  iconSvg?: string;
  order?: number;
}) {
  await db.insert(webFacilities).values({
    name: data.name,
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    iconSvg: data.iconSvg || '',
    order: data.order || 0,
  });
  revalidatePath('/admin/facilities');
  revalidatePath('/');
}

export async function updateFacility(id: number, data: Partial<typeof webFacilities.$inferInsert>) {
  await db.update(webFacilities).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(webFacilities.id, id));
  revalidatePath('/admin/facilities');
  revalidatePath('/');
}

export async function deleteFacility(id: number) {
  await db.delete(webFacilities).where(eq(webFacilities.id, id));
  revalidatePath('/admin/facilities');
  revalidatePath('/');
}

// ============================================================
// ACHIEVEMENTS / PRESTASI
// ============================================================

export async function getAchievementsList() {
  return db.select().from(webAchievements).orderBy(desc(webAchievements.year));
}

export async function createAchievement(data: {
  title: string;
  studentName?: string;
  competitionName?: string;
  level?: string;
  year?: number;
  imageUrl?: string;
}) {
  await db.insert(webAchievements).values({
    title: data.title,
    studentName: data.studentName || '',
    competitionName: data.competitionName || '',
    level: data.level || 'kecamatan',
    year: data.year || new Date().getFullYear(),
    imageUrl: data.imageUrl || '',
  });
  revalidatePath('/admin/achievements');
  revalidatePath('/prestasi');
}

export async function updateAchievement(id: number, data: Partial<typeof webAchievements.$inferInsert>) {
  await db.update(webAchievements).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(webAchievements.id, id));
  revalidatePath('/admin/achievements');
  revalidatePath('/prestasi');
}

export async function deleteAchievement(id: number) {
  await db.delete(webAchievements).where(eq(webAchievements.id, id));
  revalidatePath('/admin/achievements');
  revalidatePath('/prestasi');
}

// ============================================================
// TEACHERS / GURU
// ============================================================

export async function getTeachersList() {
  return db.select().from(webTeachers).orderBy(asc(webTeachers.order));
}

export async function createTeacher(data: {
  name: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  order?: number;
}) {
  await db.insert(webTeachers).values({
    name: data.name,
    position: data.position || '',
    bio: data.bio || '',
    photoUrl: data.photoUrl || '',
    order: data.order || 0,
  });
  revalidatePath('/admin/teachers');
  revalidatePath('/tentang');
}

export async function updateTeacher(id: number, data: Partial<typeof webTeachers.$inferInsert>) {
  await db.update(webTeachers).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(webTeachers.id, id));
  revalidatePath('/admin/teachers');
  revalidatePath('/tentang');
}

export async function deleteTeacher(id: number) {
  await db.delete(webTeachers).where(eq(webTeachers.id, id));
  revalidatePath('/admin/teachers');
  revalidatePath('/tentang');
}

// ============================================================
// SETTINGS
// ============================================================

export async function getSettingsList() {
  return db.select().from(webSettings).orderBy(asc(webSettings.settingGroup), asc(webSettings.settingKey));
}

export async function upsertSetting(key: string, value: string, group: string = 'general') {
  const [existing] = await db.select().from(webSettings).where(eq(webSettings.settingKey, key)).limit(1);
  if (existing) {
    await db.update(webSettings)
      .set({ settingValue: value, settingGroup: group, updatedAt: new Date().toISOString() })
      .where(eq(webSettings.id, existing.id));
  } else {
    await db.insert(webSettings).values({ settingKey: key, settingValue: value, settingGroup: group });
  }
  revalidatePath('/admin/settings');
  revalidatePath('/');
}

// ============================================================
// PPDB
// ============================================================

export async function getPpdbSettingsList() {
  return db.select().from(ppdbSettings).orderBy(desc(ppdbSettings.year));
}

export async function upsertPpdbSettings(data: typeof ppdbSettings.$inferInsert & { id?: number }) {
  if (data.id) {
    await db.update(ppdbSettings).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(ppdbSettings.id, data.id));
  } else {
    await db.insert(ppdbSettings).values(data);
  }
  revalidatePath('/admin/ppdb');
  revalidatePath('/ppdb');
}

export async function getPpdbRegistrationsList() {
  return db.select().from(ppdbRegistrations).orderBy(desc(ppdbRegistrations.createdAt));
}

export async function updatePpdbRegistrationStatus(id: number, status: string) {
  await db.update(ppdbRegistrations).set({ status, updatedAt: new Date().toISOString() }).where(eq(ppdbRegistrations.id, id));
  revalidatePath('/admin/ppdb');
}

// ============================================================
// CONTACT MESSAGES
// ============================================================

export async function getContactMessagesList() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  await db.insert(contactMessages).values({
    name: data.name,
    email: data.email,
    subject: data.subject || '',
    message: data.message,
  });
  revalidatePath('/admin/messages'); // Rencana halaman admin pesan
}


// ============================================================
// SEED ADMIN
// ============================================================

export async function seedAdmin() {
  const bcrypt = await import('bcryptjs');
  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, 'admin@assaodah.sch.id')).limit(1);
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 12);
    await db.insert(adminUsers).values({
      name: 'Admin',
      email: 'admin@assaodah.sch.id',
      passwordHash: hash,
      role: 'admin',
    });
    return { success: true, message: 'Admin user berhasil dibuat' };
  }
  return { success: true, message: 'Admin user sudah ada' };
}
