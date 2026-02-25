'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import { getAchievements, storageUrl, type WebAchievement } from '@/lib/api';

const levels = [
    { key: '', label: 'Semua' },
    { key: 'internasional', label: 'Internasional' },
    { key: 'nasional', label: 'Nasional' },
    { key: 'provinsi', label: 'Provinsi' },
    { key: 'kabupaten', label: 'Kabupaten' },
    { key: 'kecamatan', label: 'Kecamatan' },
];

const levelColors: Record<string, string> = {
    internasional: 'from-violet-500 to-purple-600',
    nasional: 'from-rose-500 to-pink-600',
    provinsi: 'from-sky-500 to-blue-600',
    kabupaten: 'from-emerald-500 to-teal-600',
    kecamatan: 'from-amber-500 to-orange-600',
};

export default function PrestasiPage() {
    const [achievements, setAchievements] = useState<WebAchievement[]>([]);
    const [activeLevel, setActiveLevel] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAchievements(activeLevel || undefined)
            .then(setAchievements)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [activeLevel]);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">🏆 Prestasi</span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Prestasi & <span className="text-gradient-gold">Kejuaraan</span>
                        </h1>
                        <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">Kebanggaan kami atas pencapaian santri dan siswa di berbagai kompetisi.</p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Content */}
            <section className="py-20 bg-slate-50 pattern-dots">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {levels.map(l => (
                            <button
                                key={l.key}
                                onClick={() => setActiveLevel(l.key)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeLevel === l.key
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">Belum ada data prestasi untuk level ini.</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {achievements.map((a) => (
                                    <motion.div
                                        key={a.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden">
                                            {a.image_url ? (
                                                <img src={storageUrl(a.image_url)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${levelColors[a.level] || 'from-slate-100 to-slate-200'} flex items-center justify-center`}>
                                                    <span className="text-5xl">🏆</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${levelColors[a.level] || 'from-slate-400 to-slate-500'}`}>
                                                    {a.level.charAt(0).toUpperCase() + a.level.slice(1)}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">{a.year}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{a.title}</h3>
                                            {a.competition_name && <p className="text-sm text-slate-500">{a.competition_name}</p>}
                                            {a.student_name && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-emerald-600">{a.student_name.charAt(0)}</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-600">{a.student_name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}
