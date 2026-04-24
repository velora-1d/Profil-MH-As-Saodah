import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webPrograms } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webPrograms)
      .where(eq(webPrograms.status, 'aktif'))
      .orderBy(asc(webPrograms.order));

    const data = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon_name: row.iconName,
      color: row.color,
      order: row.order,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ data: [] });
  }
}
