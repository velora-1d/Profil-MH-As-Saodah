'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Clock } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
};

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    thumbnail_url: string | null;
    published_at: string | null;
}

interface Props {
    posts: Post[];
}

const PER_PAGE = 9;

export default function InformasiClient({ posts }: Props) {
    const [page, setPage] = useState(1);

    const lastPage = Math.max(1, Math.ceil(posts.length / PER_PAGE));
    const paginated = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {paginated.length === 0 ? (
                    <div className="text-center py-20">
                        <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Belum ada artikel.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {paginated.map((post, i) => (
                                <motion.article key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group">
                                    <Link href={`/informasi/${post.slug}`} className="block">
                                        <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-5 relative shadow-sm">
                                            {post.thumbnail_url ? (
                                                <Image
                                                    src={post.thumbnail_url}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    unoptimized={post.thumbnail_url.startsWith('http')}
                                                />
                                            ) : (
                                                <Image
                                                    src="/images/hero-madrasah.png"
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
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
    );
}
