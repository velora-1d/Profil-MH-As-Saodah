import { NextResponse } from 'next/server';
import { db } from '@/db';
import { ppdbSettings, ppdbRegistrations } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Ambil setting PPDB terbaru
    const [setting] = await db.select().from(ppdbSettings)
      .orderBy(desc(ppdbSettings.year))
      .limit(1);

    if (!setting) {
      return NextResponse.json({
        data: {
          is_open: false,
          year: new Date().getFullYear().toString(),
          quota: 0,
          registered: 0,
          fee: '-',
          start_date: '-',
          end_date: '-',
        }
      });
    }

    // Hitung jumlah pendaftar untuk tahun ini
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(ppdbRegistrations)
      .where(eq(ppdbRegistrations.status, 'accepted'));

    const registered = Number(countResult?.count || 0);

    return NextResponse.json({
      data: {
        is_open: setting.isOpen,
        year: setting.year,
        quota: setting.quota,
        registered,
        fee: setting.fee || '-',
        start_date: setting.startDate || '-',
        end_date: setting.endDate || '-',
      }
    });
  } catch (error) {
    console.error('Error fetching PPDB info:', error);
    return NextResponse.json({
      data: {
        is_open: false,
        year: new Date().getFullYear().toString(),
        quota: 0,
        registered: 0,
        fee: '-',
        start_date: '-',
        end_date: '-',
      }
    });
  }
}
