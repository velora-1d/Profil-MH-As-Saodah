'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, User, MapPin, Users, Heart, FileText, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { submitPpdbRegistration } from '@/lib/api';

const STEPS = [
    { id: 1, title: 'Data Siswa', icon: User, desc: 'Identitas calon peserta didik' },
    { id: 2, title: 'Alamat & Sekolah', icon: MapPin, desc: 'Tempat tinggal & asal sekolah' },
    { id: 3, title: 'Data Ayah', icon: Users, desc: 'Identitas ayah kandung' },
    { id: 4, title: 'Data Ibu', icon: Heart, desc: 'Identitas ibu kandung' },
    { id: 5, title: 'Konfirmasi', icon: FileText, desc: 'Periksa dan kirim data' },
];

const genderOptions = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
];

const religionOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const educationOptions = ['SD/MI', 'SMP/MTs', 'SMA/MA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'];
const incomeOptions = ['< Rp 1.000.000', 'Rp 1.000.000 - 3.000.000', 'Rp 3.000.000 - 5.000.000', 'Rp 5.000.000 - 10.000.000', '> Rp 10.000.000'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

function InputField({ label, name, form, setForm, type = 'text', required = false, placeholder = '' }: {
    label: string; name: string; form: FormData; setForm: (f: FormData) => void; type?: string; required?: boolean; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input
                type={type}
                value={form[name] || ''}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                required={required}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"
            />
        </div>
    );
}

function SelectField({ label, name, form, setForm, options, required = false }: {
    label: string; name: string; form: FormData; setForm: (f: FormData) => void; options: string[] | { value: string; label: string }[]; required?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <select
                value={form[name] || ''}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                required={required}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 appearance-none"
            >
                <option value="">— Pilih —</option>
                {options.map(o => {
                    const val = typeof o === 'string' ? o : o.value;
                    const lbl = typeof o === 'string' ? o : o.label;
                    return <option key={val} value={val}>{lbl}</option>;
                })}
            </select>
        </div>
    );
}

function TextAreaField({ label, name, form, setForm, placeholder = '' }: {
    label: string; name: string; form: FormData; setForm: (f: FormData) => void; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
            <textarea
                value={form[name] || ''}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                placeholder={placeholder}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 resize-none"
            />
        </div>
    );
}

export default function PpdbDaftarPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; regNumber?: string; message?: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const next = useCallback(() => {
        if (step === 1) {
            if (!form.student_name || !form.gender) {
                setErrors({ student_name: !form.student_name ? ['Nama siswa wajib diisi'] : [], gender: !form.gender ? ['Jenis kelamin wajib dipilih'] : [] });
                return;
            }
        }
        setErrors({});
        setStep(s => Math.min(s + 1, 5));
    }, [step, form]);

    const prev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});
        try {
            const payload = { ...form, entity_id: 1, unit_id: 1 };
            const res = await submitPpdbRegistration(payload);
            setResult({ success: true, regNumber: res?.data?.registration_number });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
            if (axiosErr.response?.data?.errors) {
                setErrors(axiosErr.response.data.errors);
            }
            setResult({ success: false, message: axiosErr.response?.data?.message || 'Gagal mengirim pendaftaran. Silakan coba lagi.' });
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Result Screen ───
    if (result?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 200 }} className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3">Pendaftaran Berhasil!</h1>
                    <p className="text-slate-500 mb-6">Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.</p>
                    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm mb-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nomor Pendaftaran</p>
                        <p className="text-2xl font-black text-emerald-600">{result.regNumber}</p>
                    </div>
                    <Link href="/ppdb" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Info PPDB
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (result && !result.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center">
                    <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/30">
                        <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3">Pendaftaran Gagal</h1>
                    <p className="text-slate-500 mb-6">{result.message}</p>
                    <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25">
                        Coba Lagi
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20">
                <div className="absolute inset-0">
                    <Image src="/images/ppdb-registration.png" alt="Daftar PPDB" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/90 to-slate-950/80" />
                </div>
                <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-inset ring-amber-400/30 uppercase tracking-widest mb-5">
                            <GraduationCap className="w-3.5 h-3.5" /> Formulir Pendaftaran
                        </span>
                        <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                            Daftar <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">PPDB Online</span>
                        </h1>
                        <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">Isi formulir di bawah untuk mendaftarkan putra-putri Anda.</p>
                    </motion.div>
                </div>
            </section>

            {/* Form Body */}
            <section className="py-16 bg-slate-50">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    {/* Step Indicator */}
                    <div className="flex justify-between mb-12 relative">
                        <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-slate-200" />
                        <div className="absolute top-6 left-[10%] h-0.5 bg-emerald-500 transition-all duration-500" style={{ width: `${((step - 1) / 4) * 80}%` }} />
                        {STEPS.map(s => (
                            <div key={s.id} className="relative flex flex-col items-center text-center z-10">
                                <motion.div
                                    animate={step >= s.id ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${step >= s.id
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-500/25'
                                        : 'bg-white text-slate-400 border border-slate-200'
                                        }`}
                                >
                                    {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                                </motion.div>
                                <span className={`mt-2 text-xs font-bold hidden sm:block ${step >= s.id ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Error Banner */}
                    {Object.keys(errors).length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-rose-700 text-sm font-bold mb-1">
                                <AlertCircle className="w-4 h-4" /> Mohon perbaiki data berikut:
                            </div>
                            <ul className="text-xs text-rose-600 ml-6 list-disc">
                                {Object.entries(errors).map(([, msgs]) => msgs.map((m, i) => <li key={i}>{m}</li>))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-slate-900">{STEPS[step - 1].title}</h2>
                            <p className="text-sm text-slate-500">{STEPS[step - 1].desc}</p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Step 1: Data Siswa */}
                                {step === 1 && (
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <InputField label="Nama Lengkap Siswa" name="student_name" form={form} setForm={setForm} required placeholder="Masukkan nama lengkap" />
                                        </div>
                                        <SelectField label="Jenis Kelamin" name="gender" form={form} setForm={setForm} options={genderOptions} required />
                                        <InputField label="Tempat Lahir" name="birth_place" form={form} setForm={setForm} placeholder="Contoh: Jakarta" />
                                        <InputField label="Tanggal Lahir" name="birth_date" form={form} setForm={setForm} type="date" />
                                        <SelectField label="Agama" name="religion" form={form} setForm={setForm} options={religionOptions} />
                                        <InputField label="NIK (16 digit)" name="nik" form={form} setForm={setForm} placeholder="39xxxxxxxxxxxxxx" />
                                        <InputField label="No. KK" name="no_kk" form={form} setForm={setForm} placeholder="39xxxxxxxxxxxxxx" />
                                        <InputField label="No. HP Siswa" name="student_phone" form={form} setForm={setForm} placeholder="08xxxxxxxxxx" />
                                    </div>
                                )}

                                {/* Step 2: Alamat & Sekolah */}
                                {step === 2 && (
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <TextAreaField label="Alamat Lengkap" name="address" form={form} setForm={setForm} placeholder="Jl..., RT/RW..., Kel., Kec." />
                                        </div>
                                        <InputField label="Desa/Kelurahan" name="village" form={form} setForm={setForm} />
                                        <InputField label="Kecamatan" name="district" form={form} setForm={setForm} />
                                        <InputField label="Asal Sekolah (TK/RA)" name="previous_school" form={form} setForm={setForm} placeholder="Nama sekolah sebelumnya" />
                                        <SelectField label="Tempat Tinggal" name="residence_type" form={form} setForm={setForm} options={['Orang tua', 'Kerabat', 'Kos', 'Lainnya']} />
                                        <SelectField label="Transportasi ke Sekolah" name="transportation" form={form} setForm={setForm} options={['Jalan kaki', 'Motor', 'Jemputan Sekolah', 'Kendaraan Umum', 'Lainnya']} />
                                        <InputField label="Jarak ke Sekolah" name="distance_to_school" form={form} setForm={setForm} placeholder="Contoh: 2 km" />
                                    </div>
                                )}

                                {/* Step 3: Data Ayah */}
                                {step === 3 && (
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <InputField label="Nama Ayah" name="father_name" form={form} setForm={setForm} placeholder="Nama lengkap ayah" />
                                        </div>
                                        <InputField label="Tempat Lahir" name="father_birth_place" form={form} setForm={setForm} />
                                        <InputField label="Tanggal Lahir" name="father_birth_date" form={form} setForm={setForm} type="date" />
                                        <InputField label="NIK Ayah" name="father_nik" form={form} setForm={setForm} />
                                        <SelectField label="Pendidikan" name="father_education" form={form} setForm={setForm} options={educationOptions} />
                                        <InputField label="Pekerjaan" name="father_occupation" form={form} setForm={setForm} />
                                        <InputField label="No. HP Orang Tua" name="parent_phone" form={form} setForm={setForm} placeholder="08xxxxxxxxxx" />
                                        <SelectField label="Penghasilan Orang Tua" name="parent_income" form={form} setForm={setForm} options={incomeOptions} />
                                    </div>
                                )}

                                {/* Step 4: Data Ibu */}
                                {step === 4 && (
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <InputField label="Nama Ibu" name="mother_name" form={form} setForm={setForm} placeholder="Nama lengkap ibu" />
                                        </div>
                                        <InputField label="Tempat Lahir" name="mother_birth_place" form={form} setForm={setForm} />
                                        <InputField label="Tanggal Lahir" name="mother_birth_date" form={form} setForm={setForm} type="date" />
                                        <InputField label="NIK Ibu" name="mother_nik" form={form} setForm={setForm} />
                                        <SelectField label="Pendidikan" name="mother_education" form={form} setForm={setForm} options={educationOptions} />
                                        <InputField label="Pekerjaan" name="mother_occupation" form={form} setForm={setForm} />
                                        <div className="sm:col-span-2">
                                            <TextAreaField label="Catatan Tambahan" name="notes" form={form} setForm={setForm} placeholder="Informasi tambahan (opsional)" />
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Konfirmasi */}
                                {step === 5 && (
                                    <div className="space-y-6">
                                        {[
                                            {
                                                title: 'Data Siswa', items: [
                                                    ['Nama Lengkap', form.student_name],
                                                    ['Jenis Kelamin', form.gender === 'L' ? 'Laki-laki' : 'Perempuan'],
                                                    ['Tempat, Tgl Lahir', [form.birth_place, form.birth_date].filter(Boolean).join(', ')],
                                                    ['NIK', form.nik],
                                                    ['Agama', form.religion],
                                                ]
                                            },
                                            {
                                                title: 'Alamat', items: [
                                                    ['Alamat', form.address],
                                                    ['Desa/Kelurahan', form.village],
                                                    ['Kecamatan', form.district],
                                                    ['Asal Sekolah', form.previous_school],
                                                ]
                                            },
                                            {
                                                title: 'Data Ayah', items: [
                                                    ['Nama', form.father_name],
                                                    ['Pekerjaan', form.father_occupation],
                                                    ['No. HP', form.parent_phone],
                                                    ['Penghasilan', form.parent_income],
                                                ]
                                            },
                                            {
                                                title: 'Data Ibu', items: [
                                                    ['Nama', form.mother_name],
                                                    ['Pekerjaan', form.mother_occupation],
                                                ]
                                            },
                                        ].map(sec => (
                                            <div key={sec.title} className="bg-slate-50 rounded-2xl p-6">
                                                <h3 className="text-sm font-bold text-emerald-700 mb-3">{sec.title}</h3>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {sec.items.map(([lbl, val]) => val ? (
                                                        <div key={lbl as string} className="flex gap-2">
                                                            <span className="text-xs text-slate-400 min-w-[100px]">{lbl}</span>
                                                            <span className="text-xs font-semibold text-slate-700">{val as string}</span>
                                                        </div>
                                                    ) : null)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="mt-10 flex items-center justify-between">
                            {step > 1 ? (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={prev}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-700 border-2 border-slate-200 hover:border-emerald-300 transition-all">
                                    <ChevronLeft className="w-4 h-4" /> Sebelumnya
                                </motion.button>
                            ) : (
                                <Link href="/ppdb" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Kembali
                                </Link>
                            )}

                            {step < 5 ? (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={next}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
                                    Selanjutnya <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            ) : (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={submitting}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50">
                                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : <><GraduationCap className="w-4 h-4" /> Kirim Pendaftaran</>}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
