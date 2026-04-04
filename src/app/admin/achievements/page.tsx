'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getAchievementsList, createAchievement, updateAchievement, deleteAchievement } from '@/app/actions/cms-actions';

type Achievement = Awaited<ReturnType<typeof getAchievementsList>>[0];

const fields = [
  { name: 'title', label: 'Judul Prestasi', required: true, placeholder: 'Juara 1 Olimpiade Matematika' },
  { name: 'studentName', label: 'Nama Siswa', placeholder: 'Nama siswa peraih' },
  { name: 'competitionName', label: 'Nama Kompetisi', placeholder: 'Olimpiade Matematika Nasional' },
  {
    name: 'level', label: 'Tingkat', type: 'select' as const,
    options: [
      { label: 'Kecamatan', value: 'kecamatan' },
      { label: 'Kabupaten', value: 'kabupaten' },
      { label: 'Provinsi', value: 'provinsi' },
      { label: 'Nasional', value: 'nasional' },
      { label: 'Internasional', value: 'internasional' },
    ],
  },
  { name: 'year', label: 'Tahun', type: 'number' as const },
  { name: 'imageUrl', label: 'Foto Dokumentasi', type: 'image' as const, required: true },
];

export default function AchievementsPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Achievement } | null>(null);

  const load = async () => setData(await getAchievementsList());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updateAchievement(modal.item.id, formData);
    } else {
      await createAchievement(formData as Parameters<typeof createAchievement>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Prestasi"
        data={data}
        searchKey="title"
        columns={[
          { key: 'title', label: 'Judul', render: (item) => <span className="font-medium">{item.title}</span> },
          { key: 'studentName', label: 'Siswa' },
          {
            key: 'level',
            label: 'Tingkat',
            render: (item) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                {item.level}
              </span>
            ),
          },
          { key: 'year', label: 'Tahun' },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deleteAchievement(id); load(); }}
      />
      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Prestasi' : 'Tambah Prestasi'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
