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
        // Fetch Settings
        getSettings().then(data => {
            if (data && typeof data === 'object') {
                // If data comes in grouped format (e.g., { general: {...}, banners: {...} })
                const flat: Record<string, string> = {};
                Object.values(data).forEach((group) => {
                    if (group && typeof group === 'object') {
                        Object.assign(flat, group);
                    }
                });
                // If data is already flat
                if (Object.keys(flat).length === 0) {
                    Object.assign(flat, data);
                }
                setSettings(flat);
            }
        }).catch(err => console.error('Settings fetch error:', err));

        // Fetch Teachers
        getTeachers().then(data => {
            console.log('DEBUG: Full API response for teachers:', data);
            if (data && (data as any).data) {
                setTeachers((data as any).data);
            } else {
                setTeachers(Array.isArray(data) ? data : []);
            }
        }).catch(err => console.error('Teachers fetch error:', err));

        // Fetch Facilities
        getFacilities().then(data => {
            setFacilities(Array.isArray(data) ? data : []);
        }).catch(err => console.error('Facilities fetch error:', err));
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0">
                    <Image 
                        src={settings.banner_tentang ? storageUrl(settings.banner_tentang) : "/images/students-learning.png"} 
                        alt="Tentang Kami" 
                        fill 
                        className="object-cover" 
                        priority 
                    />
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

            {/* Sejarah */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2" />
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <SectionHeading badge="Sejarah Singkat" title="Jejak Langkah Kami" align="left" />
                            <div className="mt-8 space-y-6 text-slate-600 leading-relaxed">
                                {settings.school_history ? (
                                    settings.school_history.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))
                                ) : (
                                    <>
                                        <p>MI MH As-Saodah didirikan dengan semangat untuk memberikan pendidikan Islam yang berkualitas bagi masyarakat sekitar. Berawal dari keinginan luhur para pendiri untuk mencetak generasi yang tidak hanya cerdas secara intelektual, tetapi juga memiliki kedalaman akhlak.</p>
                                        <p>Seiring berjalannya waktu, sekolah kami terus berkembang dan berinovasi dalam metode pembelajaran, sarana prasarana, serta kualitas tenaga pendidik, namun tetap mempertahankan nilai-nilai luhur keislaman sebagai pondasi utama.</p>
                                    </>
                                )}
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            whileInView={{ opacity: 1, scale: 1 }} 
                            viewport={{ once: true }} 
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <Image 
                                src="/images/school-history.png" 
                                alt="Sejarah Sekolah" 
                                fill 
                                className="object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <p className="text-white font-bold italic">&quot;Mendidik dengan hati, membangun masa depan dengan ilmu.&quot;</p>
                            </div>
                        </motion.div>
                    </div>
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
                                                {t.photoUrl ? (
                                                    <Image src={storageUrl(t.photoUrl)} alt={t.name} fill className="object-cover" />
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
                                            <Image src={storageUrl(f.image_url)} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
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

            {/* Social & Connect */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Info & Social */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                            <SectionHeading badge="Connect" title="Tetap Terhubung" subtitle="Ikuti kegiatan kami di media sosial atau hubungi kami langsung." align="left" />
                            
                            <div className="mt-8 space-y-6">
                                <div className="flex gap-5 items-start p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 lowercase">Alamat</h4>
                                        <p className="mt-1 text-slate-500 text-sm leading-relaxed">{settings.school_address || 'Jl. Raya Pendidikan No. 123, Kota Pendidikan'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 lowercase">Email & Telepon</h4>
                                        <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                                            {settings.school_email || 'info@assaodah.sch.id'}<br />
                                            {settings.school_phone || '021-12345678'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h4 className="font-bold text-slate-900 mb-6">Sosial Media</h4>
                                <div className="flex gap-4">
                                    {[
                                        { icon: 'instagram', url: settings.social_instagram || '#' },
                                        { icon: 'facebook', url: settings.social_facebook || '#' },
                                        { icon: 'youtube', url: settings.social_youtube || '#' },
                                    ].map((s, i) => (
                                        <a key={i} href={s.url} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:scale-110 transition-all duration-300 shadow-sm">
                                            <span className="sr-only">{s.icon}</span>
                                            {/* Render simple icon based on name */}
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                {s.icon === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v.001zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                                {s.icon === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                                                {s.icon === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp} className="relative">
                            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 lowercase">Kirim Pesan</h3>
                                <p className="text-slate-500 text-sm mb-8">Punya pertanyaan? Kirim pesan kepada kami dan kami akan segera membalasnya.</p>
                                
                                <form className="space-y-4" action={async (formData) => {
                                    const { submitContactMessage } = await import('@/app/actions/cms-actions');
                                    await submitContactMessage({
                                        name: formData.get('name') as string,
                                        email: formData.get('email') as string,
                                        subject: formData.get('subject') as string,
                                        message: formData.get('message') as string,
                                    });
                                    alert('Pesan Anda telah terkirim!');
                                }}>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nama Lengkap</label>
                                            <input name="name" type="text" placeholder="Masukkan nama" required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-900 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email</label>
                                            <input name="email" type="email" placeholder="nama@email.com" required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-900 text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Subjek</label>
                                        <input name="subject" type="text" placeholder="Tanya PPDB / Info Sekolah" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-900 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Pesan</label>
                                        <textarea name="message" rows={4} placeholder="Tulis pesan Anda di sini..." required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-900 text-sm resize-none" />
                                    </div>
                                    <button type="submit" className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">Kirim Pesan Sekarang</button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
