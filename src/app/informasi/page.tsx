'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getPosts, storageUrl, type WebPost } from '@/lib/api';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
};

export default function InformasiPage() {
    const [posts, setPosts] = useState<WebPost[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPosts(page, 9)
            .then(r => { setPosts(r.data); setLastPage(r.last_page); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">📰 Informasi</span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            Berita & <span className="text-gradient-gold">Informasi</span>
                        </h1>
                        <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">Ikuti perkembangan terkini dari MI MH As-Saodah.</p>
                    </motion.div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20 bg-slate-50 pattern-dots">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">Belum ada artikel.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                {posts.map((post, i) => (
                                    <motion.article key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group">
                                        <Link href={`/informasi/${post.slug}`} className="block">
                                            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-slate-100 shadow-sm">
                                                {post.thumbnail ? (
                                                    <img src={storageUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                                                        <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {post.published_at && (
                                                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                                                        {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                )}
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                                                {post.excerpt && <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                                            </div>
                                        </Link>
                                    </motion.article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {lastPage > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Kontak Section */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeading badge="Hubungi Kami" title="Informasi Kontak" subtitle="Jangan ragu untuk bertanya atau berkunjung langsung." />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '📍', title: 'Alamat', desc: 'Jl. Contoh Alamat No. 123, Kota, Provinsi', color: 'from-emerald-500 to-teal-600' },
                            { icon: '📞', title: 'Telepon', desc: '(021) xxxx-xxxx', color: 'from-blue-500 to-indigo-600' },
                            { icon: '💬', title: 'WhatsApp', desc: '+62 xxx-xxxx-xxxx', color: 'from-green-500 to-emerald-600' },
                        ].map((c, i) => (
                            <motion.div key={c.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
                                <div className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-lg mb-4`}>{c.icon}</div>
                                <h4 className="font-bold text-slate-900 mb-1">{c.title}</h4>
                                <p className="text-sm text-slate-500">{c.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
