import { NextResponse } from 'next/server';
import { db } from '@/db';
import { ppdbRegistrations } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi field wajib
    if (!body.studentName || !body.parentName || !body.phone) {
      return NextResponse.json(
        { error: 'Nama siswa, nama orang tua, dan nomor telepon wajib diisi' },
        { status: 400 }
      );
    }

    await db.insert(ppdbRegistrations).values({
      studentName: body.studentName,
      parentName: body.parentName || '',
      phone: body.phone || '',
      email: body.email || '',
      birthDate: body.birthDate || '',
      birthPlace: body.birthPlace || '',
      gender: body.gender || 'L',
      address: body.address || '',
      previousSchool: body.previousSchool || '',
      status: 'pending',
      notes: body.notes || '',
      attachments: body.attachments || '',
    });

    return NextResponse.json({ success: true, message: 'Pendaftaran berhasil dikirim!' });
  } catch (error) {
    console.error('Error submitting registration:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pendaftaran. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
