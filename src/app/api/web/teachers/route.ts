import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webTeachers } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webTeachers).orderBy(asc(webTeachers.order));

    const data = rows.map(row => ({
      id: row.id,
      name: row.name,
      position: row.position,
      bio: row.bio,
      photo_url: row.photoUrl,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ data: [] });
  }
}
