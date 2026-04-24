'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getHeroesList, createHero, updateHero, deleteHero } from '@/app/actions/cms-actions';

type Hero = Awaited<ReturnType<typeof getHeroesList>>[0];

const fields = [
  { name: 'title', label: 'Judul', required: true, placeholder: 'Judul hero slide' },
  { name: 'subtitle', label: 'Subtitle', placeholder: 'Subtitle opsional' },
  { name: 'mediaUrl', label: 'Gambar Hero', type: 'image' as const, required: true },
  { name: 'ctaText', label: 'Teks Tombol', placeholder: 'Daftar Sekarang' },
  { name: 'ctaUrl', label: 'URL Tombol', type: 'url' as const, placeholder: '/ppdb' },
  { name: 'order', label: 'Urutan', type: 'number' as const },
  {
    name: 'status', label: 'Status', type: 'select' as const, required: true,
    options: [
      { label: 'Aktif', value: 'aktif' },
      { label: 'Draft', value: 'draft' },
    ],
  },
];

export default function HeroesPage() {
  const [data, setData] = useState<Hero[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Hero } | null>(null);

  const load = async () => {
    const result = await getHeroesList();
    setData(result);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updateHero(modal.item.id, formData);
    } else {
      await createHero(formData as Parameters<typeof createHero>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Hero Slides"
        data={data}
        searchKey="title"
        columns={[
          { key: 'title', label: 'Judul' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'order', label: 'Urutan' },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
              </span>
            ),
          },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deleteHero(id); load(); }}
      />

      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Hero' : 'Tambah Hero'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
