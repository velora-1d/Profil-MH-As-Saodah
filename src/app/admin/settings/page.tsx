'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { getSettingsList, upsertSetting } from '@/app/actions/cms-actions';

const settingsConfig = [
  { group: 'Identitas Sekolah', items: [
    { key: 'school_name', label: 'Nama Sekolah', placeholder: 'MI MH As-Saodah' },
    { key: 'school_tagline', label: 'Tagline', placeholder: 'Membangun Generasi Qurani...' },
    { key: 'school_address', label: 'Alamat', placeholder: 'Jl. Contoh No. 123' },
    { key: 'school_phone', label: 'No. Telepon', placeholder: '08xxxxxxxxx' },
    { key: 'school_email', label: 'Email', placeholder: 'info@assaodah.sch.id' },
  ]},
  { group: 'Media Sosial', items: [
    { key: 'social_whatsapp', label: 'WhatsApp', placeholder: '6281234567890' },
    { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
  ]},
  { group: 'Lainnya', items: [
    { key: 'maps_url', label: 'Google Maps URL', placeholder: 'https://maps.google.com/...' },
    { key: 'npsn', label: 'NPSN', placeholder: '12345678' },
    { key: 'akreditasi', label: 'Akreditasi', placeholder: 'A / B / C' },
  ]},
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettingsList().then((list) => {
      const map: Record<string, string> = {};
      list.forEach((s) => { map[s.settingKey] = s.settingValue; });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pengaturan Website</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi dasar website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Tersimpan ✓' : 'Simpan'}
        </button>
      </div>

      <div className="space-y-8">
        {settingsConfig.map((group) => (
          <div key={group.group} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">{group.group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">{item.label}</label>
                  <input
                    type="text"
                    value={values[item.key] || ''}
                    onChange={(e) => setValues({ ...values, [item.key]: e.target.value })}
                    placeholder={item.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
