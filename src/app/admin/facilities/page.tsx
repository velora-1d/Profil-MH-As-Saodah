'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getFacilitiesList, createFacility, updateFacility, deleteFacility } from '@/app/actions/cms-actions';

type Facility = Awaited<ReturnType<typeof getFacilitiesList>>[0];

const fields = [
  { name: 'name', label: 'Nama Fasilitas', required: true, placeholder: 'Contoh: Masjid, Lab Komputer' },
  { name: 'description', label: 'Deskripsi', type: 'textarea' as const, placeholder: 'Deskripsi fasilitas...' },
  { name: 'imageUrl', label: 'Foto Fasilitas', type: 'image' as const, required: true },
  { name: 'order', label: 'Urutan', type: 'number' as const },
];

export default function FacilitiesPage() {
  const [data, setData] = useState<Facility[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Facility } | null>(null);

  const load = async () => setData(await getFacilitiesList());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updateFacility(modal.item.id, formData);
    } else {
      await createFacility(formData as Parameters<typeof createFacility>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Fasilitas"
        data={data}
        searchKey="name"
        columns={[
          { key: 'name', label: 'Nama', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'description', label: 'Deskripsi', render: (item) => <span className="text-slate-500 line-clamp-1 text-xs">{item.description}</span> },
          { key: 'order', label: 'Urutan' },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deleteFacility(id); load(); }}
      />
      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
