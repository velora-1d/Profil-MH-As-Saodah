'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { getSettingsList, upsertSetting } from '@/app/actions/cms-actions';

interface SettingItem {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'image';
  rows?: number;
  description?: string;
}

interface SettingGroup {
  group: string;
  items: SettingItem[];
}

const settingsConfig: SettingGroup[] = [
  {
    group: 'Identitas Sekolah',
    items: [
      { key: 'school_name', label: 'Nama Sekolah', placeholder: 'MI MH As-Saodah' },
      { key: 'school_tagline', label: 'Tagline Sekolah', placeholder: 'Membangun Generasi Qurani Berakhlak Mulia...' },
      { key: 'school_address', label: 'Alamat Lengkap', placeholder: 'Jl. Contoh No. 123, Kelurahan, Kecamatan' },
      { key: 'school_phone', label: 'Nomor Telepon', placeholder: '08xxxxxxxxx' },
      { key: 'school_email', label: 'Email Resmi', placeholder: 'info@assaodah.sch.id' },
      { key: 'npsn', label: 'NPSN', placeholder: '12345678' },
      { key: 'akreditasi', label: 'Status Akreditasi', placeholder: 'A (Unggul)' },
      { key: 'web_logo_url', label: 'Logo Sekolah', type: 'image' },
    ],
  },
  {
    group: 'Visi, Misi & Sejarah',
    items: [
      {
        key: 'school_vision',
        label: 'Visi Madrasah',
        type: 'textarea',
        rows: 3,
        placeholder: 'Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qur\'ani, berilmu, berakhlak mulia, dan berwawasan global.',
        description: 'Visi utama madrasah yang tampil di halaman Tentang Kami',
      },
      {
        key: 'school_mission',
        label: 'Misi Madrasah',
        type: 'textarea',
        rows: 5,
        placeholder: 'Menyelenggarakan pendidikan berkualitas berdasarkan Al-Quran dan Sunnah\nMengembangkan potensi akademik dan non-akademik santri secara optimal\nMenanamkan nilai-nilai akhlakul karimah dalam kehidupan sehari-hari\nMenciptakan lingkungan madrasah yang islami, kondusif, dan inovatif',
        description: 'Tuliskan misi madrasah. Pisahkan setiap poin misi dengan baris baru (Enter)',
      },
      {
        key: 'school_history',
        label: 'Sejarah Singkat Madrasah',
        type: 'textarea',
        rows: 6,
        placeholder: 'MI Miftahul Huda As-Saodah didirikan dengan niat tulus untuk menyediakan pendidikan Islam yang memadukan kurikulum keagamaan dan umum secara berimbang...',
        description: 'Sejarah atau narasi latar belakang madrasah di halaman Tentang Kami',
      },
      {
        key: 'school_quote',
        label: 'Kutipan / Motto Lembaga',
        placeholder: 'Mendidik dengan hati, membangun masa depan dengan ilmu.',
      },
      {
        key: 'school_quote_author',
        label: 'Sumber Kutipan / Pengasuh',
        placeholder: 'Pengasuh Madrasah',
      },
      {
        key: 'history_image',
        label: 'Foto Dokumentasi Sejarah / Madrasah',
        type: 'image',
        description: 'Gambar pendukung di sebelah narasi sejarah',
      },
    ],
  },
  {
    group: 'Nilai-Nilai Utama (Pilar Karakter)',
    items: [
      { key: 'values_title_1', label: 'Pilar 1 - Judul', placeholder: 'Qur\'ani' },
      { key: 'values_desc_1', label: 'Pilar 1 - Deskripsi', placeholder: 'Menanamkan kecintaan, pemahaman, dan pengamalan nilai-nilai Al-Qur\'an sejak usia dini.' },
      { key: 'values_title_2', label: 'Pilar 2 - Judul', placeholder: 'Berakhlak Mulia' },
      { key: 'values_desc_2', label: 'Pilar 2 - Deskripsi', placeholder: 'Membina adab, sopan santun, dan keteladanan akhlakul karimah dalam kehidupan sehari-hari.' },
      { key: 'values_title_3', label: 'Pilar 3 - Judul', placeholder: 'Berwawasan Global' },
      { key: 'values_desc_3', label: 'Pilar 3 - Deskripsi', placeholder: 'Mempersiapkan santri yang cakap menghadapi perkembangan zaman dan teknologi modern.' },
      { key: 'values_title_4', label: 'Pilar 4 - Judul', placeholder: 'Cinta Tanah Air' },
      { key: 'values_desc_4', label: 'Pilar 4 - Deskripsi', placeholder: 'Menumbuhkan jiwa nasionalisme, cinta bangsa, dan kepedulian terhadap sesama.' },
    ],
  },
  {
    group: 'Banner & Tampilan Halaman',
    items: [
      { key: 'banner_home', label: 'Banner Utama (Beranda / Hero)', type: 'image' },
      { key: 'banner_tentang', label: 'Banner Halaman Tentang Kami', type: 'image' },
      { key: 'banner_ppdb', label: 'Banner Section PPDB', type: 'image' },
      { key: 'website_background', label: 'Background Khusus Website (Opsional)', type: 'image' },
    ],
  },
  {
    group: 'Teks Beranda & Section PPDB',
    items: [
      { key: 'home_hero_badge', label: 'Hero Badge', placeholder: 'Madrasah Ibtidaiyah Unggulan' },
      { key: 'home_hero_title', label: 'Hero Judul Utama', placeholder: 'Pendidikan Islam Berkualitas untuk Generasi Unggul' },
      { key: 'home_hero_subtitle', label: 'Hero Subtitle', type: 'textarea', rows: 2, placeholder: 'Membimbing putra-putri Anda meraih prestasi duniawi dan ukhrawi dengan kurikulum terpadu dan pembinaan akhlak.' },
      { key: 'ppdb_cta_title', label: 'PPDB Judul Ajakan', placeholder: 'Siap Bergabung dengan Keluarga Besar Kami?' },
      { key: 'ppdb_cta_subtitle', label: 'PPDB Subtitle Ajakan', type: 'textarea', rows: 2, placeholder: 'Pendaftaran Peserta Didik Baru (PPDB) telah dibuka. Kuota terbatas untuk setiap angkatan!' },
    ],
  },
  {
    group: 'Media Sosial & Kontak',
    items: [
      { key: 'social_whatsapp', label: 'Nomor WhatsApp PPDB / Layanan', placeholder: '6281234567890' },
      { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
      { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
      { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
      { key: 'maps_url', label: 'Google Maps Embed / Link', placeholder: 'https://maps.google.com/...' },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getSettingsList().then((list) => {
      const map: Record<string, string> = {};
      list.forEach((s) => { map[s.key] = s.value; });
      setValues(map);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const group of settingsConfig) {
        for (const item of group.items) {
          if (values[item.key] !== undefined) {
            await upsertSetting(item.key, values[item.key], group.group.toLowerCase().replace(/\s/g, '_'));
          }
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (key: string, file: File) => {
    setUploadingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (data.success && data.url) {
        setValues((prev) => ({ ...prev, [key]: data.url }));
      } else {
        alert(data.error || 'Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setUploadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pengaturan Website & Halaman</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola identitas, visi misi, narasi, dan banner tampilan website profil secara dinamis.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Tersimpan ✓' : 'Simpan Semua'}
        </button>
      </div>

      <div className="space-y-8">
        {settingsConfig.map((group) => (
          <div key={group.group} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
            <h2 className="text-sm font-bold text-blue-700 mb-6 uppercase tracking-wider border-b border-slate-100 pb-3">
              {group.group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.items.map((item) => {
                const isFullSpan = item.type === 'textarea' || item.type === 'image';
                return (
                  <div key={item.key} className={isFullSpan ? 'md:col-span-2' : ''}>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">{item.label}</label>
                      {item.description && (
                        <span className="text-[11px] text-slate-400">{item.description}</span>
                      )}
                    </div>

                    {item.type === 'textarea' ? (
                      <textarea
                        rows={item.rows || 3}
                        value={values[item.key] || ''}
                        onChange={(e) => setValues({ ...values, [item.key]: e.target.value })}
                        placeholder={item.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-800"
                      />
                    ) : item.type === 'image' ? (
                      <div className="space-y-3">
                        {values[item.key] ? (
                          <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={values[item.key]} 
                              alt={item.label} 
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => setValues({ ...values, [item.key]: '' })}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus Gambar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-600 text-xs font-semibold cursor-pointer transition-all">
                              {uploadingKeys[item.key] ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                  <span>Mengunggah...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-slate-500" />
                                  <span>Pilih & Unggah File Gambar</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingKeys[item.key]}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadImage(item.key, file);
                                }}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[11px] text-slate-400">JPG, PNG, WebP (Maks 10MB)</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={values[item.key] || ''}
                        onChange={(e) => setValues({ ...values, [item.key]: e.target.value })}
                        placeholder={item.placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-800"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
