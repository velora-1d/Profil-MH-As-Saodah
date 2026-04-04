import { seedAdmin } from '@/app/actions/cms-actions';
import { NextResponse } from 'next/server';

export async function GET() {
  // Hanya bisa diakses di development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Tidak diperbolehkan di production' }, { status: 403 });
  }

  const result = await seedAdmin();
  return NextResponse.json(result);
}
