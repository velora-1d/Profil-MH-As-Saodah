'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getProgramsList, createProgram, updateProgram, deleteProgram } from '@/app/actions/cms-actions';

type Program = Awaited<ReturnType<typeof getProgramsList>>[0];

const COLOR_OPTIONS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const fields = [
  { name: 'title', label: 'Nama Program', required: true, placeholder: 'Contoh: Tahfidz Al-Quran' },
  { name: 'description', label: 'Deskripsi', type: 'textarea' as const, required: true, placeholder: 'Deskripsi program unggulan...' },
  {
    name: 'iconName', label: 'Nama Icon (Lucide)', placeholder: 'Contoh: BookOpen, Star, Trophy, GraduationCap',
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

export default function ProgramsPage() {
  const [data, setData] = useState<Program[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Program } | null>(null);

  const load = async () => setData(await getProgramsList());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updateProgram(modal.item.id, formData);
    } else {
      await createProgram(formData as Parameters<typeof createProgram>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Program Unggulan"
        data={data}
        searchKey="title"
        columns={[
          { key: 'title', label: 'Nama Program', render: (item) => <span className="font-medium">{item.title}</span> },
          { key: 'description', label: 'Deskripsi', render: (item) => <span className="text-slate-500 line-clamp-1 text-xs">{item.description}</span> },
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
        onDelete={async (id) => { await deleteProgram(id); load(); }}
      />
      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Program' : 'Tambah Program'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
