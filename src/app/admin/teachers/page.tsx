'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getTeachersList, createTeacher, updateTeacher, deleteTeacher } from '@/app/actions/cms-actions';

type Teacher = Awaited<ReturnType<typeof getTeachersList>>[0];

const fields = [
  { name: 'name', label: 'Nama Guru', required: true, placeholder: 'Nama lengkap' },
  { name: 'position', label: 'Jabatan', placeholder: 'Guru Kelas / Ketua Yayasan / dsb' },
  { name: 'bio', label: 'Biografi Singkat', type: 'textarea' as const, placeholder: 'Biografi singkat...' },
  { name: 'photoUrl', label: 'Foto Guru', type: 'image' as const, required: true },
  { name: 'order', label: 'Urutan', type: 'number' as const },
];

export default function TeachersPage() {
  const [data, setData] = useState<Teacher[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Teacher } | null>(null);

  const load = async () => setData(await getTeachersList());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updateTeacher(modal.item.id, formData);
    } else {
      await createTeacher(formData as Parameters<typeof createTeacher>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Data Guru"
        data={data}
        searchKey="name"
        columns={[
          { key: 'name', label: 'Nama', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'position', label: 'Jabatan' },
          { key: 'order', label: 'Urutan' },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deleteTeacher(id); load(); }}
      />
      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Guru' : 'Tambah Guru'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
