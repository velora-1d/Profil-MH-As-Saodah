import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webFacilities } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webFacilities).orderBy(asc(webFacilities.order));

    const data = rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      image_url: row.imageUrl,
      icon_svg: row.iconSvg,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json({ data: [] });
  }
}
