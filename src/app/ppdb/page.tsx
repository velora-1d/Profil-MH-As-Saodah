'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getPpdbInfo, type PpdbInfo } from '@/lib/api';

const steps = [
    { num: 1, icon: '📋', title: 'Ambil Formulir', desc: 'Unduh dan isi formulir pendaftaran online melalui website.' },
    { num: 2, icon: '📝', title: 'Isi Data Lengkap', desc: 'Lengkapi semua data calon santri dan orang tua sesuai dokumen.' },
    { num: 3, icon: '📎', title: 'Upload Dokumen', desc: 'Unggah foto, akta kelahiran, KK, dan dokumen lainnya.' },
    { num: 4, icon: '✅', title: 'Verifikasi', desc: 'Tim kami akan memverifikasi dokumen dan data pendaftaran Anda.' },
    { num: 5, icon: '🎉', title: 'Diterima', desc: 'Selamat! Selesaikan administrasi dan siapkan hari pertama.' },
];

export default function PpdbPage() {
    const [info, setInfo] = useState<PpdbInfo | null>(null);

    useEffect(() => {
        getPpdbInfo().then(setInfo).catch(() => { });
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                            PPDB {info?.year || 'Tahun Ajaran Baru'}
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Pendaftaran Peserta<br />Didik <span className="text-gradient-gold">Baru</span>
                        </h1>
                        <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">
                            {info?.is_open ? 'Pendaftaran sedang dibuka! Segera daftarkan putra-putri Anda.' : 'Informasi lengkap tentang pendaftaran santri baru.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                        {[
                            { label: 'Status', value: info?.is_open ? '✅ Dibuka' : '⏳ Ditutup', color: info?.is_open ? 'emerald' : 'slate' },
                            { label: 'Kuota', value: info ? `${info.registered}/${info.quota}` : '-', color: 'amber' },
                            { label: 'Periode', value: info ? `${info.start_date} - ${info.end_date}` : '-', color: 'blue' },
                            { label: 'Biaya', value: info?.fee || '-', color: 'purple' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center"
                            >
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{card.label}</p>
                                <p className="text-lg font-black text-slate-900">{card.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Alur Pendaftaran */}
                    <SectionHeading badge="Alur" title="Langkah Pendaftaran" subtitle="Ikuti 5 langkah mudah untuk mendaftarkan putra-putri Anda." />
                    <div className="relative">
                        {/* Line */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-emerald-100" />
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="relative text-center"
                                >
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/25 mb-4 relative z-10">
                                        {step.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-10 border border-emerald-200 shadow-sm">
                            <p className="text-lg font-bold text-slate-900">Siap mendaftarkan putra-putri Anda?</p>
                            <p className="text-sm text-slate-500 max-w-md">Formulir pendaftaran online tersedia melalui portal dashboard. Silakan klik tombol di bawah untuk mulai mengisi data.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link href={process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/login') || '#'} target="_blank" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all active:scale-95">
                                    Daftar Via Portal
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </Link>
                                <a href="https://wa.me/62xxxxxxxxxx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-slate-700 border-2 border-slate-200 hover:border-emerald-300 transition-all">
                                    💬 Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
