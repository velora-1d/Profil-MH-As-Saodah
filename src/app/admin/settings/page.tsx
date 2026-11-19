'use client';

import { useEffect, useState } from 'react';
import { 
  Save, Loader2, Upload, Trash2, CheckCircle2, 
  Plus, Home, Info, GraduationCap, Settings as SettingsIcon,
  BookOpen, Heart, Eye, ArrowRight
} from 'lucide-react';
import { getSettingsList, upsertSetting } from '@/app/actions/cms-actions';

interface PillarItem {
  title: string;
  desc: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'tentang' | 'ppdb' | 'identitas'>('beranda');
  const [values, setValues] = useState<Record<string, string>>({});
  const [missionPoints, setMissionPoints] = useState<string[]>([]);
  const [pillars, setPillars] = useState<PillarItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getSettingsList().then((list) => {
      const map: Record<string, string> = {};
      list.forEach((s) => { map[s.key] = s.value; });
      setValues(map);

      // Parse mission points
      if (map.school_mission) {
        const points = map.school_mission.split('\n').map(p => p.trim()).filter(Boolean);
        setMissionPoints(points.length > 0 ? points : ['Menyelenggarakan pendidikan berkualitas berdasarkan Al-Quran dan Sunnah']);
      } else {
        setMissionPoints([
          'Menyelenggarakan pendidikan berkualitas berdasarkan Al-Quran dan Sunnah',
          'Mengembangkan potensi akademik dan non-akademik santri secara optimal',
          'Membina adab dan kesantunan dalam interaksi sehari-hari',
          'Mencetak generasi yang kompetitif di era global'
        ]);
      }

      // Parse pillars
      const loadedPillars: PillarItem[] = [];
      for (let i = 1; i <= 6; i++) {
        const titleKey = `values_title_${i}`;
        const descKey = `values_desc_${i}`;
        if (map[titleKey] || map[descKey]) {
          loadedPillars.push({
            title: map[titleKey] || '',
            desc: map[descKey] || '',
          });
        }
      }
      if (loadedPillars.length > 0) {
        setPillars(loadedPillars);
      } else {
        setPillars([
          { title: 'Qur\'ani', desc: 'Menanamkan kecintaan dan pengamalan nilai-nilai Al-Qur\'an sejak usia dini.' },
          { title: 'Berakhlak Mulia', desc: 'Membina adab dan kesantunan dalam interaksi sehari-hari.' },
          { title: 'Berwawasan Global', desc: 'Mempersiapkan santri dengan wawasan ilmu pengetahuan modern.' },
          { title: 'Cinta Tanah Air', desc: 'Menumbuhkan jiwa nasionalisme dan kepedulian sosial.' },
        ]);
      }
    });
  }, []);

  const handleAddMissionPoint = () => {
    setMissionPoints([...missionPoints, '']);
  };

  const handleRemoveMissionPoint = (index: number) => {
    setMissionPoints(missionPoints.filter((_, i) => i !== index));
  };

  const handleMissionChange = (index: number, text: string) => {
    const updated = [...missionPoints];
    updated[index] = text;
    setMissionPoints(updated);
  };

  const handleAddPillar = () => {
    setPillars([...pillars, { title: '', desc: '' }]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars(pillars.filter((_, i) => i !== index));
  };

  const handlePillarChange = (index: number, field: 'title' | 'desc', text: string) => {
    const updated = [...pillars];
    updated[index][field] = text;
    setPillars(updated);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Simpan misi yang digabung jadi teks multi-baris
      const cleanMission = missionPoints.map(p => p.trim()).filter(Boolean).join('\n');
      await upsertSetting('school_mission', cleanMission, 'visi_misi');

      // 2. Simpan nilai-nilai pilar
      for (let i = 0; i < pillars.length; i++) {
        await upsertSetting(`values_title_${i + 1}`, pillars[i].title, 'nilai_karakter');
        await upsertSetting(`values_desc_${i + 1}`, pillars[i].desc, 'nilai_karakter');
      }

      // 3. Simpan semua key lainnya di values
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'school_mission') {
          await upsertSetting(key, value || '', 'umum');
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            CMS Page Builder & Customizer
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Kelola Konten Per Halaman</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih menu halaman di bawah untuk mengedit setiap section, teks, gambar, dan poin dinamis secara langsung.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Tersimpan ✓' : 'Simpan Semua Perubahan'}
        </button>
      </div>

      {/* Tabs Menu Halaman */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('beranda')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'beranda'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Halaman Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tentang')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tentang'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Halaman Tentang Kami</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ppdb')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'ppdb'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Section & Alur PPDB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identitas')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'identitas'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Identitas & Media Sosial</span>
        </button>
      </div>

      {/* ─── TAB 1: BERANDA ─── */}
      {activeTab === 'beranda' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Section 1: Hero Banner & Tagline Utama
            </h2>
            <p className="text-xs text-slate-500 mb-6">Teks dan gambar utama yang tampil pertama kali saat pengunjung membuka beranda.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Hero Badge Teks</label>
                <input
                  type="text"
                  value={values.home_hero_badge || ''}
                  onChange={(e) => setValues({ ...values, home_hero_badge: e.target.value })}
                  placeholder="Madrasah Ibtidaiyah Unggulan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Hero</label>
                <input
                  type="text"
                  value={values.home_hero_title || ''}
                  onChange={(e) => setValues({ ...values, home_hero_title: e.target.value })}
                  placeholder="Membangun Generasi Qur'ani & Berwawasan Global"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle / Deskripsi Hero</label>
                <textarea
                  rows={3}
                  value={values.home_hero_subtitle || ''}
                  onChange={(e) => setValues({ ...values, home_hero_subtitle: e.target.value })}
                  placeholder="Mencetak generasi berilmu, berakhlak mulia, dan siap menghadapi tantangan masa depan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Banner Background Hero (Gambar Utama)</label>
                {values.banner_home ? (
                  <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={values.banner_home} alt="Banner Home" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValues({ ...values, banner_home: '' })}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Ganti Gambar
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 cursor-pointer w-fit text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Banner Hero</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUploadImage('banner_home', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Section 2: Banner Call to Action PPDB di Beranda
            </h2>
            <p className="text-xs text-slate-500 mb-6">Ajakan pendaftaran murid baru di bagian bawah halaman beranda.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Ajakan PPDB</label>
                <input
                  type="text"
                  value={values.ppdb_cta_title || ''}
                  onChange={(e) => setValues({ ...values, ppdb_cta_title: e.target.value })}
                  placeholder="Siap Bergabung dengan Keluarga Besar Kami?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle Ajakan</label>
                <input
                  type="text"
                  value={values.ppdb_cta_subtitle || ''}
                  onChange={(e) => setValues({ ...values, ppdb_cta_subtitle: e.target.value })}
                  placeholder="Pendaftaran Peserta Didik Baru telah dibuka. Kuota terbatas!"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Banner Background PPDB</label>
                {values.banner_ppdb ? (
                  <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={values.banner_ppdb} alt="Banner PPDB" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValues({ ...values, banner_ppdb: '' })}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Ganti Gambar
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 cursor-pointer w-fit text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload Banner PPDB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUploadImage('banner_ppdb', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TENTANG KAMI ─── */}
      {activeTab === 'tentang' && (
        <div className="space-y-6">
          {/* Section: Banner Hero Tentang */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Section 1: Banner Header Halaman Tentang
            </h2>
            <p className="text-xs text-slate-500 mb-4">Gambar latar belakang di header halaman Tentang Kami.</p>
            {values.banner_tentang ? (
              <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                <img src={values.banner_tentang} alt="Banner Tentang" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setValues({ ...values, banner_tentang: '' })}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Ganti Gambar
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 cursor-pointer w-fit text-xs font-bold text-slate-600">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Upload Banner Tentang Kami</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUploadImage('banner_tentang', e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Section: Sejarah */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Section 2: Sejarah & Motto Madrasah
            </h2>
            <p className="text-xs text-slate-500 mb-6">Narasi pendirian sekolah, foto dokumentasi sejarah, dan kutipan motto.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Narasi Sejarah Singkat</label>
                <textarea
                  rows={5}
                  value={values.school_history || ''}
                  onChange={(e) => setValues({ ...values, school_history: e.target.value })}
                  placeholder="MI MH As-Saodah didirikan dengan semangat untuk memberikan pendidikan Islam yang berkualitas..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Kutipan / Motto Lembaga</label>
                  <input
                    type="text"
                    value={values.school_quote || ''}
                    onChange={(e) => setValues({ ...values, school_quote: e.target.value })}
                    placeholder="Mendidik dengan hati, membangun masa depan dengan ilmu."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Penulis / Sumber Kutipan</label>
                  <input
                    type="text"
                    value={values.school_quote_author || ''}
                    onChange={(e) => setValues({ ...values, school_quote_author: e.target.value })}
                    placeholder="Kepala Madrasah / Dewan Pengasuh"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Foto Dokumentasi Sejarah Sekolah</label>
                {values.history_image ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={values.history_image} alt="Foto Sejarah" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValues({ ...values, history_image: '' })}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 cursor-pointer w-fit text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>Upload Foto Sejarah</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUploadImage('history_image', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Section: Visi & Misi Dinamis dengan Tambah Poin */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Section 3: Visi & Misi (+ Fitur Tambah Poin)
            </h2>
            <p className="text-xs text-slate-500 mb-6">Kelola visi utama dan tambahkan poin-poin misi madrasah secara fleksibel.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Visi Utama Madrasah</label>
                <textarea
                  rows={3}
                  value={values.school_vision || ''}
                  onChange={(e) => setValues({ ...values, school_vision: e.target.value })}
                  placeholder="Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qur'ani, berilmu, berakhlak mulia, dan berwawasan global."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Misi List Repeater */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" /> Poin-Poin Misi Madrasah
                    </h3>
                    <p className="text-xs text-slate-500">Setiap poin akan otomatis ditampilkan rapi berikon di website.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMissionPoint}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Poin Misi
                  </button>
                </div>

                <div className="space-y-3">
                  {missionPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleMissionChange(index, e.target.value)}
                        placeholder={`Tuliskan misi ke-${index + 1}...`}
                        className="w-full px-3 py-1.5 text-sm text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMissionPoint(index)}
                        disabled={missionPoints.length <= 1}
                        className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                        title="Hapus poin ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Nilai-Nilai Utama / Pilar Karakter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Section 4: Pilar Karakter & Nilai Utama
                </h2>
                <p className="text-xs text-slate-500">Kartu-kartu karakter khas santri di halaman Tentang Kami.</p>
              </div>
              <button
                type="button"
                onClick={handleAddPillar}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pilar Karakter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map((pillar, index) => (
                <div key={index} className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      Pilar #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePillar(index)}
                      disabled={pillars.length <= 1}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-30 p-1 transition-colors cursor-pointer"
                      title="Hapus pilar ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Pilar</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => handlePillarChange(index, 'title', e.target.value)}
                      placeholder="Contoh: Qur'ani"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Deskripsi Pilar</label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => handlePillarChange(index, 'desc', e.target.value)}
                      placeholder="Penjelasan karakter..."
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PPDB ─── */}
      {activeTab === 'ppdb' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Informasi Kuota & Narasi PPDB
            </h2>
            <p className="text-xs text-slate-500 mb-6">Pengaturan informasi pendaftaran yang tampil di portal publik.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tahun Ajaran PPDB</label>
                <input
                  type="text"
                  value={values.ppdb_year || ''}
                  onChange={(e) => setValues({ ...values, ppdb_year: e.target.value })}
                  placeholder="2025/2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WhatsApp Layanan PPDB</label>
                <input
                  type="text"
                  value={values.social_whatsapp || values.ppdb_whatsapp || ''}
                  onChange={(e) => setValues({ ...values, social_whatsapp: e.target.value, ppdb_whatsapp: e.target.value })}
                  placeholder="6281234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Biaya Pendaftaran</label>
                <input
                  type="text"
                  value={values.ppdb_fee || ''}
                  onChange={(e) => setValues({ ...values, ppdb_fee: e.target.value })}
                  placeholder="Gratis / Rp 150.000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Kuota Siswa</label>
                <input
                  type="text"
                  value={values.ppdb_quota || ''}
                  onChange={(e) => setValues({ ...values, ppdb_quota: e.target.value })}
                  placeholder="60"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: IDENTITAS & MEDSOS ─── */}
      {activeTab === 'identitas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Identitas Resmi Lembaga
            </h2>
            <p className="text-xs text-slate-500 mb-6">Logo, nama madrasah, alamat resmi, dan kontak.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Resmi Madrasah</label>
                <input
                  type="text"
                  value={values.school_name || ''}
                  onChange={(e) => setValues({ ...values, school_name: e.target.value })}
                  placeholder="MI MH As-Saodah"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tagline Madrasah</label>
                <input
                  type="text"
                  value={values.school_tagline || ''}
                  onChange={(e) => setValues({ ...values, school_tagline: e.target.value })}
                  placeholder="Membangun Generasi Qur'ani Berakhlak Mulia..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">NPSN</label>
                <input
                  type="text"
                  value={values.npsn || ''}
                  onChange={(e) => setValues({ ...values, npsn: e.target.value })}
                  placeholder="12345678"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Akreditasi</label>
                <input
                  type="text"
                  value={values.akreditasi || ''}
                  onChange={(e) => setValues({ ...values, akreditasi: e.target.value })}
                  placeholder="A (Unggul)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Lengkap</label>
                <input
                  type="text"
                  value={values.school_address || ''}
                  onChange={(e) => setValues({ ...values, school_address: e.target.value })}
                  placeholder="Jl. Raya Pendidikan No. 123..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Telepon Kantor</label>
                <input
                  type="text"
                  value={values.school_phone || ''}
                  onChange={(e) => setValues({ ...values, school_phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Resmi</label>
                <input
                  type="text"
                  value={values.school_email || ''}
                  onChange={(e) => setValues({ ...values, school_email: e.target.value })}
                  placeholder="info@assaodah.sch.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Logo Resmi Sekolah</label>
                {values.web_logo_url ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 bg-white p-2 group shadow-xs">
                    <img src={values.web_logo_url} alt="Logo" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setValues({ ...values, web_logo_url: '' })}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 cursor-pointer w-fit text-xs font-bold text-slate-600">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Logo Sekolah</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleUploadImage('web_logo_url', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Media Sosial & Peta Lokasi
            </h2>
            <p className="text-xs text-slate-500 mb-6">Tautan akun sosial media dan Google Maps di bagian footer.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Instagram Link</label>
                <input
                  type="text"
                  value={values.social_instagram || ''}
                  onChange={(e) => setValues({ ...values, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Facebook Link</label>
                <input
                  type="text"
                  value={values.social_facebook || ''}
                  onChange={(e) => setValues({ ...values, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube Link</label>
                <input
                  type="text"
                  value={values.social_youtube || ''}
                  onChange={(e) => setValues({ ...values, social_youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Google Maps Link / Embed</label>
                <input
                  type="text"
                  value={values.maps_url || ''}
                  onChange={(e) => setValues({ ...values, maps_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
