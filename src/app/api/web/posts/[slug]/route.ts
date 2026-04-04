import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { webPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const [post] = await db
      .select()
      .from(webPosts)
      .where(eq(webPosts.slug, slug))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { error: 'Post tidak ditemukan' },
        { status: 404 }
      );
    }

    const data = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      thumbnail_url: post.thumbnailUrl,
      status: post.status,
      published_at: post.publishedAt,
      meta_title: post.metaTitle,
      meta_description: post.metaDescription,
      author: null,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
