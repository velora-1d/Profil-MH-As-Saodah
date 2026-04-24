'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getStatsList, createStat, updateStat, deleteStat } from '@/app/actions/cms-actions';

type Stat = Awaited<ReturnType<typeof getStatsList>>[0];

const COLOR_OPTIONS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const fields = [
  { name: 'label', label: 'Label Statistik', required: true, placeholder: 'Contoh: Jumlah Siswa, Tenaga Pengajar' },
  { name: 'value', label: 'Angka', type: 'number' as const, required: true, placeholder: 'Contoh: 250' },
  { name: 'suffix', label: 'Suffix', placeholder: 'Contoh: +, %, Tahun (biarkan kosong jika tidak ada)' },
  {
    name: 'iconName', label: 'Nama Icon (Lucide)', placeholder: 'Contoh: Users, GraduationCap, Trophy, BookOpen',
    hint: 'Cari nama icon di lucide.dev',
  },
  {
    name: 'color', label: 'Warna Gradien', type: 'select' as const,
    options: COLOR_OPTIONS.map(c => ({ label: c, value: c })),
  },
  { name: 'order', label: 'Urutan Tampil', type: 'number' as const },
  {
    name: 'status', label: 'Status', type: 'select' as const,
    options: [{ label: 'Aktif', value: 'aktif' }, { label: 'Nonaktif', value: 'nonaktif' }],
  },
];

export default function StatsPage() {
  const [data, setData] = useState<Stat[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Stat } | null>(null);

  const load = async () => setData(await getStatsList());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    const processed = {
      ...formData,
      value: Number(formData.value) || 0,
      order: Number(formData.order) || 0,
    };
    if (modal?.mode === 'edit' && modal.item) {
      await updateStat(modal.item.id, processed);
    } else {
      await createStat(processed as Parameters<typeof createStat>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Statistik Sekolah"
        data={data}
        searchKey="label"
        columns={[
          { key: 'label', label: 'Label', render: (item) => <span className="font-medium">{item.label}</span> },
          {
            key: 'value', label: 'Angka', render: (item) => (
              <span className="font-bold text-emerald-600">{item.value}{item.suffix}</span>
            )
          },
          { key: 'iconName', label: 'Icon', render: (item) => <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{item.iconName}</code> },
          { key: 'order', label: 'Urutan' },
          {
            key: 'status', label: 'Status', render: (item) => (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {item.status}
              </span>
            )
          },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deleteStat(id); load(); }}
      />
      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Statistik' : 'Tambah Statistik'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
