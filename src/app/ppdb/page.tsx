'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, CheckCircle, Users, Calendar, CreditCard, ClipboardList, FileText, Upload, ShieldCheck, PartyPopper, ExternalLink, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { getPpdbInfo, type PpdbInfo } from '@/lib/api';

const steps = [
    { num: 1, icon: ClipboardList, title: 'Ambil Formulir', desc: 'Unduh dan isi formulir pendaftaran online melalui website.', color: 'from-emerald-500 to-teal-600' },
    { num: 2, icon: FileText, title: 'Isi Data Lengkap', desc: 'Lengkapi semua data calon santri dan orang tua sesuai dokumen.', color: 'from-blue-500 to-indigo-600' },
    { num: 3, icon: Upload, title: 'Upload Dokumen', desc: 'Unggah foto, akta kelahiran, KK, dan dokumen lainnya.', color: 'from-amber-500 to-orange-600' },
    { num: 4, icon: ShieldCheck, title: 'Verifikasi', desc: 'Tim kami akan memverifikasi dokumen dan data pendaftaran Anda.', color: 'from-purple-500 to-violet-600' },
    { num: 5, icon: PartyPopper, title: 'Diterima', desc: 'Selamat! Selesaikan administrasi dan siapkan hari pertama.', color: 'from-rose-500 to-pink-600' },
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
                <div className="absolute inset-0">
                    <Image src="/images/ppdb-registration.png" alt="PPDB" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/85 to-slate-950/70" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-amber-300 ring-1 ring-inset ring-amber-400/30 uppercase tracking-widest mb-6">
                            <GraduationCap className="w-3.5 h-3.5" />
                            PPDB {info?.year || 'Tahun Ajaran Baru'}
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Pendaftaran Peserta<br />Didik <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Baru</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
                            {info?.is_open ? 'Pendaftaran sedang dibuka! Segera daftarkan putra-putri Anda.' : 'Informasi lengkap tentang pendaftaran santri baru.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="relative -mt-14 z-20">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: CheckCircle, label: 'Status', value: info?.is_open ? 'Dibuka' : 'Ditutup', color: info?.is_open ? 'from-emerald-500 to-teal-600' : 'from-slate-400 to-slate-500' },
                            { icon: Users, label: 'Kuota', value: info ? `${info.registered}/${info.quota}` : '-', color: 'from-amber-500 to-orange-600' },
                            { icon: Calendar, label: 'Periode', value: info ? `${info.start_date} - ${info.end_date}` : '-', color: 'from-blue-500 to-indigo-600' },
                            { icon: CreditCard, label: 'Biaya', value: info?.fee || '-', color: 'from-purple-500 to-violet-600' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
                            >
                                <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg mb-3`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-sm font-black text-slate-900">{card.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alur Pendaftaran */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    <SectionHeading badge="Alur" title="Langkah Pendaftaran" subtitle="Ikuti 5 langkah mudah untuk mendaftarkan putra-putri Anda." />
                    <div className="relative mt-4">
                        {/* Connector Line */}
                        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200" />
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="relative text-center group"
                                >
                                    <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <span className="inline-block text-xs font-bold text-slate-400 mb-1">Langkah {step.num}</span>
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
                        className="mt-20"
                    >
                        <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-3xl p-10 border border-emerald-100 shadow-sm text-center">
                            <GraduationCap className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
                            <p className="text-xl font-bold text-slate-900 mb-2">Siap mendaftarkan putra-putri Anda?</p>
                            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">Formulir pendaftaran online tersedia melalui portal dashboard. Silakan klik tombol di bawah untuk mulai mengisi data.</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href="/ppdb/daftar"
                                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
                                    Daftar Online Sekarang
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <a href="https://wa.me/62xxxxxxxxxx" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-slate-700 border-2 border-slate-200 hover:border-emerald-300 transition-all">
                                    <MessageCircle className="w-4 h-4" />
                                    Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
