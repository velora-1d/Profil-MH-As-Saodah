'use client';

import { useState } from 'react';
import { X, Loader2, Save, Upload } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'url' | 'image';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface CrudFormModalProps {
  title: string;
  fields: Field[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

export default function CrudFormModal({
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
}: CrudFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const defaults = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'checkbox' ? false : '' }), {});
    return { ...defaults, ...(initialData || {}) };
  });
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingField) return; // Tunggu upload selesai
    setSaving(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (fieldName: string, file: File) => {
    setUploadingField(fieldName);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      const response = await axios.post('/api/upload', uploadData);
      if (response.data.success) {
        setFormData((prev) => ({ ...prev, [fieldName]: response.data.url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengunggah gambar. Silakan coba lagi.');
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                   value={String(formData[field.name] ?? '')}
                   onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                   required={field.required}
                   placeholder={field.placeholder}
                   rows={4}
                   className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-none"
                />
              ) : field.type === 'select' ? (
                <select
                  value={String(formData[field.name] ?? '')}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-white"
                >
                  <option value="">Pilih...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-600">Aktif</span>
                </label>
              ) : field.type === 'image' ? (
                <div className="space-y-3">
                  {formData[field.name] ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                      <Image 
                        src={String(formData[field.name])} 
                        alt="Preview" 
                        fill
                        className="object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, [field.name]: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(field.name, file);
                        }}
                        className="hidden"
                        id={`file-${field.name}`}
                        disabled={uploadingField === field.name}
                      />
                      <label 
                        htmlFor={`file-${field.name}`}
                        className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-400 transition-all cursor-pointer group"
                      >
                        {uploadingField === field.name ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            <span className="text-xs text-slate-500">Mengunggah...</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600">Pilih Gambar</span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                  {/* Backup field hidden input to store URL */}
                  <input 
                    type="hidden" 
                    name={field.name} 
                    value={String(formData[field.name] ?? '')} 
                    required={field.required}
                  />
                </div>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={String(formData[field.name] ?? '')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                    })
                  }
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              )}
            </div>
          ))}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !!uploadingField}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
