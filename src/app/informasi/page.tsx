'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Clock, MapPin, Phone, MessageCircle } from 'lucide-react';
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
            .then(r => { setPosts(Array.isArray(r?.data) ? r.data : []); setLastPage(r?.last_page || 1); })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28">
                <div className="absolute inset-0">
                    <Image src="/images/hero-madrasah.png" alt="Informasi" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/85 to-slate-950/70" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">
                            <Newspaper className="w-3.5 h-3.5" /> Informasi
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            Berita & <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Informasi</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Ikuti perkembangan terkini dari MI MH As-Saodah.</p>
                    </motion.div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">Belum ada artikel.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                {posts.map((post, i) => (
                                    <motion.article key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group">
                                        <Link href={`/informasi/${post.slug}`} className="block">
                                            <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-5 relative shadow-sm">
                                                {post.thumbnail_url ? (
                                                    <img src={storageUrl(post.thumbnail_url)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <Image src="/images/hero-madrasah.png" alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className="space-y-2.5">
                                                {post.published_at && (
                                                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                                        <Clock className="w-3.5 h-3.5" />
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
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: MapPin, title: 'Alamat', desc: 'Bojong Limus, Linggajaya, Kec. Mangkubumi, Kab. Tasikmalaya, Jawa Barat 46181', color: 'from-emerald-500 to-teal-600' },
                            { icon: Phone, title: 'Email', desc: 'mi.mhassaodah@gmail.com', color: 'from-blue-500 to-indigo-600' },
                            { icon: MessageCircle, title: 'WhatsApp', desc: '+62 xxx-xxxx-xxxx', color: 'from-green-500 to-emerald-600' },
                        ].map((c, i) => (
                            <motion.div key={c.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative overflow-hidden rounded-3xl h-full">
                                {/* Gradient border */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
                                <div className="relative bg-white rounded-3xl p-7 border border-slate-100 group-hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center h-full flex flex-col items-center justify-center">
                                    {/* Icon glow */}
                                    <div className="relative mx-auto mb-4">
                                        <div className={`absolute inset-0 w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${c.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                        <div className={`relative mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <c.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors duration-300">{c.title}</h4>
                                    <p className="text-sm text-slate-500">{c.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Google Maps Embed */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4!2d108.1983238!3d-7.3366371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f57f441d787c1%3A0x8546eda76292740e!2sMI%20MIFTAHUL%20HUDA%20AS%20SAODAH%20BOJONG%20LIMUS!5e0!3m2!1sid!2sid!4v1"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi MI MH As-Saodah"
                            className="w-full"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
