import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webAchievements } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    let query = db.select().from(webAchievements);

    if (level) {
      query = query.where(eq(webAchievements.level, level)) as typeof query;
    }

    const rows = await query.orderBy(desc(webAchievements.year));

    const data = rows.map(row => ({
      id: row.id,
      title: row.title,
      student_name: row.studentName,
      competition_name: row.competitionName,
      level: row.level,
      year: row.year,
      image_url: row.imageUrl,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ data: [] });
  }
}
