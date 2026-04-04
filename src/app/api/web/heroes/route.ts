import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webHeroes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webHeroes)
      .where(eq(webHeroes.isActive, true))
      .orderBy(asc(webHeroes.order));

    // Transformasi ke format snake_case yang diharapkan frontend
    const data = rows.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      media_type: row.mediaType,
      media_url: row.mediaUrl,
      cta_text: row.ctaText,
      cta_url: row.ctaUrl,
      order: row.order,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching heroes:', error);
    return NextResponse.json({ data: [] });
  }
}
