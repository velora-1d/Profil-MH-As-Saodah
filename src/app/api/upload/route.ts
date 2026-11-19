import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Coba upload ke Cloudinary jika environment variables tersedia
    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (hasCloudinary) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'mh-assaodah/cms',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else if (!result) reject(new Error('Cloudinary did not return a result'));
              else resolve(result);
            }
          ).end(buffer);
        }) as { secure_url: string; public_id: string };

        return NextResponse.json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload gagal, beralih ke local storage fallback:', cloudErr);
      }
    }

    // 2. Local Storage Fallback (Simpan ke public/uploads)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split('.').pop() || 'png';
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '');
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const localUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      public_id: uniqueFileName,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah file' },
      { status: 500 }
    );
  }
}
