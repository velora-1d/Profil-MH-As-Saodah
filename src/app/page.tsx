'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionHeading from '@/components/SectionHeading';
import { getHeroes, getFacilities, getPosts, getSettings, storageUrl, type WebHero, type WebFacility, type WebPost } from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }
  }),
};

export default function Home() {
  const [heroes, setHeroes] = useState<WebHero[]>([]);
  const [facilities, setFacilities] = useState<WebFacility[]>([]);
  const [posts, setPosts] = useState<WebPost[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    getHeroes().then(setHeroes).catch(() => { });
    getFacilities().then(setFacilities).catch(() => { });
    getPosts(1, 3).then(r => setPosts(r.data)).catch(() => { });
    getSettings().then(data => {
      const flat: Record<string, string> = {};
      if (data && typeof data === 'object') {
        Object.values(data).forEach((group: Record<string, string>) => {
          if (typeof group === 'object') Object.assign(flat, group);
        });
      }
      setSettings(flat);
    }).catch(() => { });
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (heroes.length <= 1) return;
    const timer = setInterval(() => setHeroIndex(p => (p + 1) % heroes.length), 5000);
    return () => clearInterval(timer);
  }, [heroes.length]);

  const currentHero = heroes[heroIndex];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.span
                custom={0} variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 uppercase tracking-widest"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Pesantren & Sekolah Modern
              </motion.span>

              <motion.h1
                custom={1} variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1]"
              >
                {currentHero ? (
                  currentHero.title
                ) : (
                  <>
                    Membangun <span className="text-gradient-gold">Generasi</span> Qur&apos;ani & Berwawasan Global
                  </>
                )}
              </motion.h1>

              <motion.p
                custom={2} variants={fadeUp}
                className="text-lg text-emerald-100/70 leading-relaxed max-w-xl border-l-4 border-amber-400/60 pl-5 italic"
              >
                {currentHero?.subtitle || settings.site_tagline || 'Pendidikan berkualitas dengan landasan akhlakul karimah untuk masa depan umat yang gemilang.'}
              </motion.p>

              <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/ppdb"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-bold text-amber-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-200 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Daftar Sekarang
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="/tentang"
                  className="rounded-2xl bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </motion.div>

              {/* Hero dots */}
              {heroes.length > 1 && (
                <motion.div custom={4} variants={fadeUp} className="flex gap-2 pt-4">
                  {heroes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {currentHero?.media_url ? (
                  currentHero.media_type === 'video' ? (
                    <video src={storageUrl(currentHero.media_url)} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={storageUrl(currentHero.media_url)} alt={currentHero.title} className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center">
                    <svg className="w-32 h-32 text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3z" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 glass-dark p-5 rounded-2xl border border-white/10">
                  <p className="text-white/80 text-sm italic leading-relaxed">&quot;Tempat terbaik untuk menimba ilmu dan memperdalam spiritualitas.&quot;</p>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100">
                <p className="text-2xl font-black text-emerald-600">A</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Akreditasi</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-amber-100">
                <p className="text-2xl font-black text-amber-500">🏆</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">100+ Prestasi</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs font-semibold uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter end={1200} suffix="+" label="Santri & Siswa" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
            <AnimatedCounter end={80} suffix="+" label="Tenaga Pendidik" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>} />
            <AnimatedCounter end={15} suffix="+" label="Ekstrakurikuler" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} />
            <AnimatedCounter end={100} suffix="%" label="Lulusan Terbaik" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} />
          </div>
        </div>
      </section>

      {/* ===== BENTO GRID — PROGRAM UNGGULAN ===== */}
      <section className="py-24 bg-slate-50 pattern-dots">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="Keunggulan"
            title="Program Unggulan Madrasah"
            subtitle="Kurikulum integratif yang memadukan keunggulan akademik, tahfidz, dan pengembangan karakter."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📖', title: 'Tahfidz Al-Quran', desc: 'Program hafalan Al-Quran terstruktur dengan target khatam 30 juz.', color: 'from-emerald-500 to-teal-600' },
              { icon: '🔬', title: 'Sains & Teknologi', desc: 'Laboratorium modern dan kurikulum STEM untuk mencetak generasi inovatif.', color: 'from-blue-500 to-indigo-600' },
              { icon: '🌍', title: 'Bahasa Asing', desc: 'Penguasaan Bahasa Arab dan Inggris aktif sejak kelas 1.', color: 'from-purple-500 to-violet-600' },
              { icon: '🎨', title: 'Seni & Kreativitas', desc: 'Kaligrafi, nasyid, dan berbagai kegiatan seni islami.', color: 'from-rose-500 to-pink-600' },
              { icon: '⚽', title: 'Olahraga & Pencak Silat', desc: 'Pembinaan fisik dan bela diri untuk karakter tangguh.', color: 'from-amber-500 to-orange-600' },
              { icon: '🤝', title: 'Leadership & Dakwah', desc: 'Program kepemimpinan dan kemampuan dakwah generasi muda.', color: 'from-cyan-500 to-sky-600' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                className="group relative bg-white rounded-2xl p-7 border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FASILITAS ===== */}
      {facilities.length > 0 && (
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              badge="Fasilitas"
              title="Lingkungan Belajar Terbaik"
              subtitle="Fasilitas modern untuk mendukung proses belajar-mengajar yang optimal."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.slice(0, 6).map((f, i) => (
                <motion.div
                  key={f.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    {f.image_url ? (
                      <img src={storageUrl(f.image_url)} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
                      </div>
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

      {/* ===== PPDB CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900" />
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-emerald-200 ring-1 ring-inset ring-white/20 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Pendaftaran Dibuka
            </span>
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Bergabung Bersama Kami<br />Tahun Ajaran Baru
            </h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Daftarkan putra-putri Anda untuk mendapatkan pendidikan terbaik yang menggabungkan ilmu umum dan ilmu agama.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-10 py-4 text-base font-bold text-amber-950 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all duration-200 active:scale-95"
              >
                Daftar PPDB Online
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/informasi"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm px-10 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                Info Selengkapnya
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== BERITA TERBARU ===== */}
      {posts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <SectionHeading
                badge="Informasi"
                title="Berita Terbaru"
                subtitle="Ikuti perkembangan terkini dari MI MH As-Saodah."
                center={false}
              />
              <Link href="/informasi" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Lihat Semua
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group"
                >
                  <Link href={`/informasi/${post.slug}`} className="block">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-slate-100">
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
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
