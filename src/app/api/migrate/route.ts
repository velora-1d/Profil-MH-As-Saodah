import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Tidak diperbolehkan di production' }, { status: 403 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Create CMS tables
    await sql`
      CREATE TABLE IF NOT EXISTS cms_admin_users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_settings (
        id SERIAL PRIMARY KEY,
        setting_key TEXT NOT NULL UNIQUE,
        setting_value TEXT NOT NULL DEFAULT '',
        setting_group TEXT NOT NULL DEFAULT 'general',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_heroes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT DEFAULT '',
        media_type TEXT NOT NULL DEFAULT 'image',
        media_url TEXT NOT NULL DEFAULT '',
        cta_text TEXT DEFAULT '',
        cta_url TEXT DEFAULT '',
        "order" INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_facilities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        icon_svg TEXT DEFAULT '',
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_achievements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        student_name TEXT DEFAULT '',
        competition_name TEXT DEFAULT '',
        level TEXT NOT NULL DEFAULT 'kecamatan',
        year INTEGER NOT NULL DEFAULT 2025,
        image_url TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        thumbnail_url TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'draft',
        published_at TIMESTAMP,
        author_id INTEGER,
        meta_title TEXT DEFAULT '',
        meta_description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_web_teachers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        photo_url TEXT DEFAULT '',
        "order" INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_ppdb_settings (
        id SERIAL PRIMARY KEY,
        year TEXT NOT NULL,
        is_open BOOLEAN NOT NULL DEFAULT false,
        quota INTEGER NOT NULL DEFAULT 0,
        fee TEXT NOT NULL DEFAULT '',
        start_date TEXT NOT NULL DEFAULT '',
        end_date TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms_ppdb_registrations (
        id SERIAL PRIMARY KEY,
        student_name TEXT NOT NULL,
        parent_name TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        email TEXT DEFAULT '',
        birth_date TEXT DEFAULT '',
        birth_place TEXT DEFAULT '',
        gender TEXT NOT NULL DEFAULT 'L',
        address TEXT DEFAULT '',
        previous_school TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT DEFAULT '',
        attachments TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS cms_achievements_level_idx ON cms_web_achievements(level)`;
    await sql`CREATE INDEX IF NOT EXISTS cms_achievements_year_idx ON cms_web_achievements(year)`;
    await sql`CREATE INDEX IF NOT EXISTS cms_posts_slug_idx ON cms_web_posts(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS cms_posts_status_idx ON cms_web_posts(status)`;
    await sql`CREATE INDEX IF NOT EXISTS cms_posts_published_idx ON cms_web_posts(published_at)`;
    await sql`CREATE INDEX IF NOT EXISTS cms_ppdb_reg_status_idx ON cms_ppdb_registrations(status)`;

    return NextResponse.json({
      success: true,
      message: 'Semua tabel CMS berhasil dibuat!',
      tables: [
        'cms_admin_users',
        'cms_web_settings',
        'cms_web_heroes',
        'cms_web_facilities',
        'cms_web_achievements',
        'cms_web_posts',
        'cms_web_teachers',
        'cms_ppdb_settings',
        'cms_ppdb_registrations',
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
