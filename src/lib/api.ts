import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: { 'Accept': 'application/json' },
});

// ============ TYPES ============

export interface WebSetting {
    [key: string]: string;
}

export interface WebHero {
    id: number;
    title: string;
    subtitle: string | null;
    media_type: 'image' | 'video';
    media_url: string;
    cta_text: string | null;
    cta_url: string | null;
    order: number;
}

export interface WebFacility {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    icon_svg: string | null;
}

export interface WebAchievement {
    id: number;
    title: string;
    student_name: string | null;
    competition_name: string | null;
    level: string;
    year: number;
    image_url: string | null;
}

export interface WebPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    thumbnail: string | null;
    status: string;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    author: { name: string } | null;
}

export interface WebTeacher {
    id: number;
    name: string;
    position: string | null;
    bio: string | null;
    photo_url: string | null;
}

export interface PpdbInfo {
    is_open: boolean;
    year: string;
    quota: number;
    registered: number;
    fee: string;
    start_date: string;
    end_date: string;
}

// ============ FETCHERS ============

const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/storage') || 'http://localhost:8000/storage';

export function storageUrl(path: string | null): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}/${path}`;
}

export async function getSettings(): Promise<Record<string, WebSetting>> {
    const { data } = await api.get('/web/settings');
    return data;
}

export async function getHeroes(): Promise<WebHero[]> {
    const { data } = await api.get('/web/heroes');
    return data;
}

export async function getFacilities(): Promise<WebFacility[]> {
    const { data } = await api.get('/web/facilities');
    return data;
}

export async function getAchievements(level?: string): Promise<WebAchievement[]> {
    const { data } = await api.get('/web/achievements', { params: level ? { level } : {} });
    return data;
}

export async function getPosts(page = 1, perPage = 9): Promise<{ data: WebPost[]; last_page: number; total: number }> {
    const { data } = await api.get('/web/posts', { params: { page, per_page: perPage } });
    return data;
}

export async function getPostBySlug(slug: string): Promise<WebPost> {
    const { data } = await api.get(`/web/posts/${slug}`);
    return data;
}

export async function getTeachers(): Promise<WebTeacher[]> {
    const { data } = await api.get('/web/teachers');
    return data;
}

export async function getPpdbInfo(): Promise<PpdbInfo> {
    const { data } = await api.get('/web/ppdb/info');
    return data;
}

export async function submitPpdbRegistration(formData: Record<string, unknown>) {
    const { data } = await api.post('/ppdb/register', formData);
    return data;
}

export async function uploadAttachment(file: File, type: string) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const { data } = await api.post('/web/ppdb/upload-attachment', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

export default api;
