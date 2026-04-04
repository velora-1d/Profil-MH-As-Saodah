'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import CrudFormModal from '@/components/admin/CrudFormModal';
import { getPostsList, createPost, updatePost, deletePost } from '@/app/actions/cms-actions';

type Post = Awaited<ReturnType<typeof getPostsList>>[0];

const fields = [
  { name: 'title', label: 'Judul', required: true, placeholder: 'Judul berita' },
  { name: 'slug', label: 'Slug URL', required: true, placeholder: 'judul-berita-contoh' },
  { name: 'excerpt', label: 'Ringkasan', type: 'textarea' as const, placeholder: 'Ringkasan singkat...' },
  { name: 'content', label: 'Konten', type: 'textarea' as const, required: true, placeholder: 'Isi artikel...' },
  { name: 'thumbnailUrl', label: 'Gambar Thumbnail', type: 'image' as const, required: true },
  {
    name: 'status', label: 'Status', type: 'select' as const, required: true,
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ],
  },
  { name: 'metaTitle', label: 'Meta Title (SEO)', placeholder: 'Judul untuk mesin pencari' },
  { name: 'metaDescription', label: 'Meta Description (SEO)', type: 'textarea' as const, placeholder: 'Deskripsi untuk mesin pencari' },
];

export default function PostsPage() {
  const [data, setData] = useState<Post[]>([]);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Post } | null>(null);

  const load = async () => {
    const result = await getPostsList();
    setData(result);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (modal?.mode === 'edit' && modal.item) {
      await updatePost(modal.item.id, formData);
    } else {
      await createPost(formData as Parameters<typeof createPost>[0]);
    }
    load();
  };

  return (
    <>
      <CrudTable
        title="Berita & Informasi"
        data={data}
        searchKey="title"
        columns={[
          { key: 'title', label: 'Judul', render: (item) => <span className="font-medium line-clamp-1">{item.title}</span> },
          { key: 'slug', label: 'Slug', render: (item) => <span className="text-slate-400 text-xs font-mono">/{item.slug}</span> },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {item.status === 'published' ? 'Published' : 'Draft'}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Tanggal',
            render: (item) => <span className="text-xs text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</span>,
          },
        ]}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(item) => setModal({ mode: 'edit', item })}
        onDelete={async (id) => { await deletePost(id); load(); }}
      />

      {modal && (
        <CrudFormModal
          title={modal.mode === 'edit' ? 'Edit Berita' : 'Tambah Berita'}
          fields={fields}
          initialData={modal.item as unknown as Record<string, unknown>}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
