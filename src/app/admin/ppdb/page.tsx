'use client';

import { useEffect, useState } from 'react';
import CrudTable from '@/components/admin/CrudTable';
import { getPpdbRegistrationsList, updatePpdbRegistrationStatus } from '@/app/actions/cms-actions';
import PpdbDetailModal from '@/components/admin/PpdbDetailModal';
import { Eye } from 'lucide-react';

type Registration = Awaited<ReturnType<typeof getPpdbRegistrationsList>>[0];

export default function PpdbPage() {
  const [data, setData] = useState<Registration[]>([]);
  const [selectedItem, setSelectedItem] = useState<Registration | null>(null);

  const load = async () => setData(await getPpdbRegistrationsList());
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await updatePpdbRegistrationStatus(id, status);
    load();
  };

  return (
    <>
      <CrudTable
        title="Pendaftar PPDB"
        data={data}
        searchKey="studentName"
        columns={[
          { key: 'studentName', label: 'Nama Siswa', render: (item) => <span className="font-medium">{item.studentName}</span> },
          { key: 'parentName', label: 'Nama Ortu' },
          { key: 'phone', label: 'Telepon' },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer ${
                  item.status === 'approved' ? 'bg-emerald-50 text-emerald-700'
                    : item.status === 'rejected' ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <option value="pending">Menunggu</option>
                <option value="approved">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            ),
          },
          {
            key: 'createdAt',
            label: 'Tgl Daftar',
            render: (item) => <span className="text-xs text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}</span>,
          },
          {
            key: 'actions',
            label: 'Aksi',
            render: (item) => (
              <button
                onClick={() => setSelectedItem(item)}
                className="p-1 px-3 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 font-bold"
              >
                <Eye className="w-3.5 h-3.5" /> Detail
              </button>
            ),
          },
        ]}
      />

      {selectedItem && (
        <PpdbDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}

