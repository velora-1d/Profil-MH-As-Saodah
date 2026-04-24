import { NextResponse } from 'next/server';
import { db } from '@/db';
import { webSettings } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(webSettings).orderBy(asc(webSettings.group), asc(webSettings.key));

    // Group by group, lalu key-value pairs
    const grouped: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      const group = row.group || 'general';
      if (!grouped[group]) grouped[group] = {};
      grouped[group][row.key] = row.value;
    }

    return NextResponse.json({ data: grouped });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ data: {} });
  }
}
