'use client';

import { X, User, Phone, MapPin, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PpdbDetailModalProps {
  item: {
    id: number;
    studentName: string;
    parentName: string;
    phone: string;
    email: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    gender: string;
    address: string | null;
    previousSchool: string | null;
    status: string;
    notes: string | null;
    attachments: string | null;
    createdAt: string;
  };
  onClose: () => void;
}


export default function PpdbDetailModal({ item, onClose }: PpdbDetailModalProps) {
  if (!item) return null;

  const detailGroups = [
    {
      title: 'Data Siswa',
      icon: <User className="w-5 h-5 text-emerald-600" />,
      fields: [
        { label: 'Nama Lengkap', value: item.studentName },
        { label: 'Tempat, Tgl Lahir', value: `${item.birthPlace || '-'}, ${item.birthDate || '-'}` },
        { label: 'Jenis Kelamin', value: item.gender === 'L' ? 'Laki-laki' : 'Perempuan' },
        { label: 'Sekolah Asal', value: item.previousSchool || '-' },
      ]
    },
    {
      title: 'Kontak Orang Tua',
      icon: <Phone className="w-5 h-5 text-amber-600" />,
      fields: [
        { label: 'Nama Orang Tua', value: item.parentName },
        { label: 'WhatsApp / Telepon', value: item.phone },
        { label: 'Email', value: item.email || '-' },
      ]
    },
    {
      title: 'Alamat & Tambahan',
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      fields: [
        { label: 'Alamat Lengkap', value: item.address || '-' },
        { label: 'Catatan', value: item.notes || '-' },
        { label: 'Tanggal Daftar', value: item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : '-' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Detail Pendaftaran</h2>
              <p className="text-emerald-100/80 text-sm mt-0.5">ID Pendaftaran: #{item.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid gap-8">
              {detailGroups.map((group, gIdx) => (
                <div key={gIdx}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {group.icon}
                    </div>
                    <h3 className="font-bold text-slate-900">{group.title}</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 pl-12">
                    {group.fields.map((field, fIdx) => (
                      <div key={fIdx}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          {field.label}
                        </label>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {item.attachments && (
                <div className="mt-4 pt-6 border-t border-slate-100">
                   <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <Info className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Lampiran / Berkas</h3>
                  </div>
                  <div className="pl-12">
                    <a 
                      href={item.attachments} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      Buka Lampiran Terlampir
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Status Display */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status:</span>
               <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  item.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : item.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {item.status}
               </span>
            </div>
            
            <button
               onClick={onClose}
               className="px-6 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
