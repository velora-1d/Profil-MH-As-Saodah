import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webPosts } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '9')));
    const offset = (page - 1) * perPage;

    // Hanya tampilkan post yang published
    const rows = await db.select().from(webPosts)
      .where(eq(webPosts.status, 'published'))
      .orderBy(desc(webPosts.publishedAt), desc(webPosts.createdAt))
      .limit(perPage)
      .offset(offset);

    // Count total
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(webPosts)
      .where(eq(webPosts.status, 'published'));

    const total = Number(countResult?.count || 0);
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    const data = rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      thumbnail_url: row.thumbnailUrl,
      status: row.status,
      published_at: row.publishedAt,
      meta_title: row.metaTitle,
      meta_description: row.metaDescription,
      author: null,
    }));

    return NextResponse.json({
      data: {
        data,
        last_page: lastPage,
        total,
        current_page: page,
        per_page: perPage,
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ data: { data: [], last_page: 1, total: 0 } });
  }
}
