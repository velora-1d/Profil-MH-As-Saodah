import { getPostBySlug, getPosts, storageUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await getPostBySlug(slug);
        return {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt || '',
            openGraph: {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt || '',
                type: 'article',
                images: post.thumbnail_url ? [{ url: storageUrl(post.thumbnail_url) }] : [],
            },
        };
    } catch {
        return { title: 'Artikel Tidak Ditemukan' };
    }
}

export default async function DetailArtikelPage({ params }: PageProps) {
    const { slug } = await params;
    let post;
    try {
        post = await getPostBySlug(slug);
    } catch {
        notFound();
    }

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <Link href="/informasi" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300 hover:text-white transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Kembali ke Informasi
                    </Link>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">{post.title}</h1>
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-emerald-200/60">
                        {post.author && <span>Oleh: <strong className="text-emerald-200">{post.author.name}</strong></span>}
                        {post.published_at && (
                            <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    {/* Thumbnail */}
                    {post.thumbnail_url && (
                        <div className="mb-10 -mt-20 relative z-20">
                            <img src={storageUrl(post.thumbnail_url)} alt={post.title} className="w-full rounded-2xl shadow-2xl border border-white/20 aspect-[16/9] object-cover" />
                        </div>
                    )}

                    {/* Article Body */}
                    <div
                        className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* JSON-LD */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'Article',
                                headline: post.title,
                                description: post.excerpt || '',
                                datePublished: post.published_at || '',
                                author: { '@type': 'Person', name: post.author?.name || 'Admin' },
                                publisher: {
                                    '@type': 'Organization',
                                    name: 'MI MH As-Saodah',
                                },
                                image: post.thumbnail_url ? storageUrl(post.thumbnail_url) : undefined,
                            }),
                        }}
                    />

                    {/* Back */}
                    <div className="mt-16 pt-8 border-t border-slate-100">
                        <Link href="/informasi" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Lihat Semua Artikel
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
