import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webStats } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webStats)
      .where(eq(webStats.status, 'aktif'))
      .orderBy(asc(webStats.order));

    const data = rows.map(row => ({
      id: row.id,
      label: row.label,
      value: row.value,
      suffix: row.suffix,
      icon_name: row.iconName,
      color: row.color,
      order: row.order,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ data: [] });
  }
}
