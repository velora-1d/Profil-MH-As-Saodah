import { db } from '@/db';
import { webPosts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Image from 'next/image';
import { Newspaper, MapPin, Phone, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import InformasiClient from './InformasiClient';

export const revalidate = 60; // ISR: revalidasi setiap 60 detik

export const metadata = {
    title: 'Berita & Informasi | MI MH As-Saodah',
    description: 'Ikuti perkembangan terkini dari MI MH As-Saodah',
};

export default async function InformasiPage() {
    // Langsung query DB — tidak bergantung API URL eksternal
    const rows = await db
        .select()
        .from(webPosts)
        .where(eq(webPosts.status, 'published'))
        .orderBy(desc(webPosts.publishedAt), desc(webPosts.createdAt))
        .limit(100);

    const posts = rows.map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt ?? null,
        thumbnail_url: row.thumbnailUrl ?? null,
        published_at: row.publishedAt ? row.publishedAt.toString() : null,
    }));

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28">
                <div className="absolute inset-0">
                    <Image src="/images/hero-madrasah.png" alt="Informasi" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/85 to-slate-950/70" />
                </div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest mb-6">
                            <Newspaper className="w-3.5 h-3.5" /> Informasi
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                            Berita & <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Informasi</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Ikuti perkembangan terkini dari MI MH As-Saodah.</p>
                    </div>
                </div>
            </section>

            {/* Posts Grid — dirender via client component untuk animasi + pagination */}
            <InformasiClient posts={posts} />

            {/* Kontak Section */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeading badge="Hubungi Kami" title="Informasi Kontak" subtitle="Jangan ragu untuk bertanya atau berkunjung langsung." />
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: MapPin, title: 'Alamat', desc: 'Bojong Limus, Linggajaya, Kec. Mangkubumi, Kab. Tasikmalaya, Jawa Barat 46181', color: 'from-emerald-500 to-teal-600' },
                            { icon: Phone, title: 'Email', desc: 'mi.mhassaodah@gmail.com', color: 'from-blue-500 to-indigo-600' },
                            { icon: MessageCircle, title: 'WhatsApp', desc: '+62 xxx-xxxx-xxxx', color: 'from-green-500 to-emerald-600' },
                        ].map((c) => (
                            <div key={c.title} className="group relative overflow-hidden rounded-3xl h-full">
                                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
                                <div className="relative bg-white rounded-3xl p-7 border border-slate-100 group-hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center h-full flex flex-col items-center justify-center">
                                    <div className="relative mx-auto mb-4">
                                        <div className={`absolute inset-0 w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${c.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                        <div className={`relative mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <c.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors duration-300">{c.title}</h4>
                                    <p className="text-sm text-slate-500">{c.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Google Maps Embed */}
                    <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
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
                    </div>
                </div>
            </section>
        </div>
    );
}
