'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Trophy, Users, GraduationCap, Star, Heart, Globe, Lightbulb, ChevronRight, ArrowRight, Clock } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionHeading from '@/components/SectionHeading';
import { getHeroes, getFacilities, getPosts, getSettings, storageUrl, type WebHero, type WebFacility, type WebPost, type WebSetting } from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }
  }),
};

const stats = [
  { icon: BookOpen, label: 'Program Unggulan', value: 6, suffix: '+', color: 'from-emerald-500 to-teal-600' },
  { icon: Trophy, label: 'Prestasi Diraih', value: 50, suffix: '+', color: 'from-amber-500 to-orange-600' },
  { icon: Users, label: 'Siswa Aktif', value: 200, suffix: '+', color: 'from-blue-500 to-indigo-600' },
  { icon: GraduationCap, label: 'Tahun Berdiri', value: 15, suffix: '+', color: 'from-rose-500 to-pink-600' },
];

const programs = [
  { icon: BookOpen, title: 'Tahfidz Al-Quran', desc: 'Program unggulan hafalan Al-Quran dengan metode modern dan menyenangkan.', color: 'from-emerald-500 to-teal-600' },
  { icon: Globe, title: 'Bilingual Program', desc: 'Pembelajaran dwibahasa untuk mempersiapkan generasi global.', color: 'from-blue-500 to-indigo-600' },
  { icon: Lightbulb, title: 'Sains & Teknologi', desc: 'Eksplorasi sains dan teknologi untuk menumbuhkan daya pikir kritis.', color: 'from-amber-500 to-orange-600' },
  { icon: Star, title: 'Pengembangan Karakter', desc: 'Pembentukan akhlak mulia melalui pembiasaan dan keteladanan.', color: 'from-rose-500 to-pink-600' },
  { icon: Heart, title: 'Bimbingan Ibadah', desc: 'Pendampingan intensif dalam ibadah harian dan pemahaman fiqih.', color: 'from-purple-500 to-violet-600' },
  { icon: Trophy, title: 'Olimpiade & Lomba', desc: 'Persiapan dan pembinaan untuk berbagai kompetisi akademik.', color: 'from-cyan-500 to-blue-600' },
];

export default function HomePage() {
  const [heroes, setHeroes] = useState<WebHero[]>([]);
  const [facilities, setFacilities] = useState<WebFacility[]>([]);
  const [posts, setPosts] = useState<WebPost[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    getHeroes().then(data => setHeroes(Array.isArray(data) ? data : [])).catch(() => { });
    getFacilities().then(data => setFacilities(Array.isArray(data) ? data : [])).catch(() => { });
    getPosts(1, 3).then(r => setPosts(Array.isArray(r?.data) ? r.data : [])).catch(() => { });
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

  useEffect(() => {
    if (heroes.length <= 1) return;
    const timer = setInterval(() => setHeroIndex(p => (p + 1) % heroes.length), 5000);
    return () => clearInterval(timer);
  }, [heroes.length]);

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image src="/images/hero-madrasah.png" alt="MI MH As-Saodah" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-emerald-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-5 py-2 text-sm font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 mb-8">
                <Star className="w-4 h-4" />
                Madrasah Ibtidaiyah Unggulan
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
            >
              Membangun Generasi{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Qur&apos;ani
              </span>{' '}
              &amp; Berwawasan Global
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl"
            >
              {settings.school_tagline || 'Mencetak generasi berilmu, berakhlak mulia, dan siap menghadapi tantangan masa depan dengan landasan Al-Quran dan Sunnah.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/ppdb" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-0.5">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/tentang" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/20 transition-all duration-300">
                Tentang Kami
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats Badges */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-20"
        >
          {stats.slice(0, 3).map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 ring-1 ring-white/10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-white"><AnimatedCounter target={s.value} />{s.suffix}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative -mt-16 z-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-white/60 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full"
              >
                {/* Decorative glow */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <s.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-black text-slate-900"><AnimatedCounter target={s.value} />{s.suffix}</p>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAM UNGGULAN ─── */}
      <section className="py-28 bg-gradient-to-b from-white via-emerald-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading badge="Program Kami" title="Program Unggulan" subtitle="Kurikulum terintegrasi yang menggabungkan ilmu agama dan umum untuk menghasilkan lulusan terbaik." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {programs.map((p, i) => (
              <motion.div key={p.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group relative overflow-hidden h-full"
              >
                {/* Gradient border trick */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-transparent to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white rounded-3xl p-8 border border-slate-100 group-hover:border-transparent shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  {/* Icon with glow */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <p.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">{p.desc}</p>
                  {/* Corner decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-emerald-50 to-transparent rounded-tl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Arrow hint */}
                  <div className="mt-auto pt-5 flex items-center gap-1 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Selengkapnya <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FASILITAS ─── */}
      {facilities.length > 0 && (
        <section className="py-28 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading badge="Sarana Prasarana" title="Fasilitas Kami" subtitle="Lingkungan belajar yang nyaman, modern, dan mendukung tumbuh kembang anak secara optimal." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {facilities.map((f, i) => (
                <motion.div key={f.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 border border-slate-100 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {f.image_url ? (
                      <img src={storageUrl(f.image_url)} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <Image src="/images/school-facilities.png" alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-lg">{f.name}</h3>
                    {f.description && <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{f.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA PPDB ─── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ppdb-registration.png" alt="PPDB" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-emerald-950/85" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-5 py-2 text-sm font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/30 mb-6">
              <GraduationCap className="w-4 h-4" />
              Penerimaan Peserta Didik Baru
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
              Wujudkan Masa Depan <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Cerah</span> Putra-Putri Anda
            </h2>
            <p className="mt-6 text-lg text-emerald-100/70 max-w-2xl mx-auto">
              Daftarkan sekarang dan bergabung bersama keluarga besar MI MH As-Saodah. Kuota terbatas!
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/ppdb/daftar" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-bold text-slate-900 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:-translate-y-0.5">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="https://wa.me/62xxxxxxxxxx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-8 py-4 text-base font-bold text-white ring-1 ring-white/20 hover:bg-white/20 transition-all duration-300">
                Hubungi via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── BERITA TERBARU ─── */}
      {posts.length > 0 && (
        <section className="py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-end justify-between mb-4">
              <SectionHeading badge="Terkini" title="Berita & Informasi" subtitle="Ikuti perkembangan terbaru dari MI MH As-Saodah." align="left" />
              <Link href="/informasi" className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post, i) => (
                <motion.article key={post.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group">
                  <Link href={`/informasi/${post.slug}`} className="block">
                    <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-5 relative shadow-sm">
                      {post.thumbnail ? (
                        <img src={storageUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
            <div className="mt-10 text-center md:hidden">
              <Link href="/informasi" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Lihat Semua Berita <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
