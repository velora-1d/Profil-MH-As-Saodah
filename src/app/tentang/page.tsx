'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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
        getTeachers().then(setTeachers).catch(() => { });
        getFacilities().then(setFacilities).catch(() => { });
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">
                            Tentang Kami
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Mengenal Lebih Dekat<br /><span className="text-gradient-gold">MI MH As-Saodah</span>
                        </h1>
                        <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">Madrasah yang berkomitmen mencetak generasi unggul berilmu dan berakhlak mulia.</p>
                    </motion.div>
                </div>
            </section>

            {/* Visi Misi */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeading badge="Visi & Misi" title="Landasan Pendidikan Kami" />
                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 shadow-sm">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl shadow-lg mb-5">🎯</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Visi</h3>
                            <p className="text-slate-600 leading-relaxed">{settings.school_vision || 'Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qur\'ani, berilmu, berakhlak mulia, dan berwawasan global.'}</p>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100 shadow-sm">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg mb-5">📋</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Misi</h3>
                            <div className="text-slate-600 leading-relaxed space-y-2">
                                {settings.school_mission ? (
                                    <p>{settings.school_mission}</p>
                                ) : (
                                    <ul className="space-y-2">
                                        <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Menyelenggarakan pendidikan berkualitas berdasarkan Al-Quran dan Sunnah</li>
                                        <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Mengembangkan potensi akademik dan non-akademik santri secara optimal</li>
                                        <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Membentuk karakter Islami yang kuat dan berakhlakul karimah</li>
                                        <li className="flex gap-2"><span className="text-emerald-500 font-bold">•</span> Mempersiapkan generasi yang kompetitif di era global</li>
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Profil Guru */}
            {teachers.length > 0 && (
                <section id="guru" className="py-24 bg-slate-50 pattern-dots">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <SectionHeading badge="Tenaga Pendidik" title="Guru Berdedikasi Kami" subtitle="Para pendidik berpengalaman yang siap membimbing putra-putri Anda." />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {teachers.map((t, i) => (
                                <motion.div key={t.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group bg-white rounded-2xl p-5 text-center border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300">
                                    <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden border-3 border-emerald-100 shadow-md">
                                        {t.photo_url ? (
                                            <img src={storageUrl(t.photo_url)} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                                <span className="text-2xl font-black text-emerald-600">{t.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">{t.position || 'Guru'}</p>
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
                                <motion.div key={f.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-video overflow-hidden">
                                        {f.image_url ? (
                                            <img src={storageUrl(f.image_url)} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center"><svg className="w-12 h-12 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg></div>
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
