'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Target, ClipboardList, BookOpen, Heart } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { getSettings, getTeachers, getFacilities, storageUrl, type WebTeacher, type WebFacility } from '@/lib/api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
};

export default function TentangPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [teachers, setTeachers] = useState<WebTeacher[]>([]);
    const [facilities, setFacilities] = useState<WebFacility[]>([]);

    useEffect(() => {
        getSettings().then(data => {
            const flat: Record<string, string> = {};
            if (data && typeof data === 'object') {
                Object.values(data).forEach((g: Record<string, string>) => { if (typeof g === 'object') Object.assign(flat, g); });
            }
            setSettings(flat);
        }).catch(() => { });
        getTeachers().then(data => setTeachers(Array.isArray(data) ? data : [])).catch(() => { });
        getFacilities().then(data => setFacilities(Array.isArray(data) ? data : [])).catch(() => { });
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/images/students-learning.png" alt="Tentang Kami" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-emerald-900/70" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">
                            <Heart className="w-3.5 h-3.5" /> Tentang Kami
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Mengenal Lebih Dekat<br /><span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">MI MH As-Saodah</span>
                        </h1>
                        <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">Madrasah yang berkomitmen mencetak generasi unggul berilmu dan berakhlak mulia.</p>
                    </motion.div>
                </div>
            </section>

            {/* Visi Misi */}
            <section className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeading badge="Visi & Misi" title="Landasan Pendidikan Kami" />
                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="group relative overflow-hidden rounded-3xl h-full">
                            {/* Subtle gradient border */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-500/10 rounded-3xl" />
                            <div className="relative bg-gradient-to-br from-emerald-50/80 to-white rounded-3xl p-8 m-[1px] backdrop-blur-sm h-full">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 blur-xl opacity-20" />
                                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <Target className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Visi</h3>
                                <p className="text-slate-600 leading-relaxed">{settings.school_vision || 'Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qur\'ani, berilmu, berakhlak mulia, dan berwawasan global.'}</p>
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="group relative overflow-hidden rounded-3xl h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/10 rounded-3xl" />
                            <div className="relative bg-gradient-to-br from-amber-50/80 to-white rounded-3xl p-8 m-[1px] backdrop-blur-sm h-full">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 blur-xl opacity-20" />
                                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <ClipboardList className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Misi</h3>
                                <div className="text-slate-600 leading-relaxed space-y-2">
                                    {settings.school_mission ? (
                                        <p>{settings.school_mission}</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {['Menyelenggarakan pendidikan berkualitas berdasarkan Al-Quran dan Sunnah',
                                                'Mengembangkan potensi akademik dan non-akademik santri secara optimal',
                                                'Membentuk karakter Islami yang kuat dan berakhlakul karimah',
                                                'Mempersiapkan generasi yang kompetitif di era global'].map((m, i) => (
                                                    <li key={i} className="flex gap-3 items-start">
                                                        <BookOpen className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                        <span>{m}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Profil Guru */}
            {teachers.length > 0 && (
                <section id="guru" className="py-24 bg-slate-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <SectionHeading badge="Tenaga Pendidik" title="Guru Berdedikasi Kami" subtitle="Para pendidik berpengalaman yang siap membimbing putra-putri Anda." />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {teachers.map((t, i) => (
                                <motion.div key={t.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative overflow-hidden rounded-3xl h-full">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-amber-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white rounded-3xl p-5 text-center border border-slate-100 group-hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                                        <div className="mx-auto mb-4 relative">
                                            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                                            <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden ring-3 ring-emerald-100 group-hover:ring-emerald-300 shadow-md transition-all duration-500 group-hover:scale-105">
                                                {t.photo_url ? (
                                                    <img src={storageUrl(t.photo_url)} alt={t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                                        <span className="text-2xl font-black text-emerald-600">{t.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">{t.name}</h4>
                                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">{t.position || 'Guru'}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Fasilitas */}
            {facilities.length > 0 && (
                <section id="fasilitas" className="py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <SectionHeading badge="Fasilitas" title="Sarana & Prasarana" subtitle="Lingkungan belajar yang nyaman dan lengkap." />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {facilities.map((f, i) => (
                                <motion.div key={f.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-video overflow-hidden relative">
                                        {f.image_url ? (
                                            <img src={storageUrl(f.image_url)} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <Image src="/images/school-facilities.png" alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900">{f.name}</h3>
                                        {f.description && <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{f.description}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
