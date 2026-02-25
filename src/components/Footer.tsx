'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Heart, Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { getSettings } from '@/lib/api';
import { useEffect, useState } from 'react';

const footerLinks = [
    {
        title: 'Navigasi',
        links: [
            { href: '/', label: 'Beranda' },
            { href: '/tentang', label: 'Tentang Kami' },
            { href: '/prestasi', label: 'Prestasi' },
            { href: '/informasi', label: 'Berita & Artikel' },
            { href: '/ppdb', label: 'Pendaftaran PPDB' },
        ],
    },
    {
        title: 'Akademik',
        links: [
            { href: '/tentang#kurikulum', label: 'Kurikulum' },
            { href: '/tentang#fasilitas', label: 'Fasilitas' },
            { href: '/tentang#guru', label: 'Tenaga Pendidik' },
            { href: '/prestasi', label: 'Prestasi Santri' },
        ],
    },
];

const socials = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
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

    return (
        <footer className="relative bg-slate-950 text-white overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-950/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-950/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10">
                    {/* Brand */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="lg:col-span-1 space-y-5">
                        <div className="flex items-center gap-3">
                            {settings.logo_url ? (
                                <img src={settings.logo_url} alt="Logo" className="h-12 w-12 object-contain rounded-xl" />
                            ) : (
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg flex items-center justify-center">
                                    <span className="text-white font-black text-xl">M</span>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-black tracking-tight">MH As-Saodah</h3>
                                <p className="text-xs font-semibold text-emerald-400 -mt-0.5 tracking-wider uppercase">Madrasah Ibtidaiyah</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Membangun generasi Qur&apos;ani yang berwawasan global dengan pendidikan berkualitas dan akhlakul karimah.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {socials.map(s => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors duration-200"
                                >
                                    <s.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links */}
                    {footerLinks.map((group, gi) => (
                        <motion.div key={group.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={gi + 1} variants={fadeUp}>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5">{group.title}</h4>
                            <ul className="space-y-3">
                                {group.links.map(link => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
                                            <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-emerald-400 group-hover:scale-150 transition-all duration-200" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Contact */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5">Kontak</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>Bojong Limus, Linggajaya, Kec. Mangkubumi, Kab. Tasikmalaya, Jawa Barat 46181</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span>mi.mhassaodah@gmail.com</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span>(021) xxxx-xxxx</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} MI MH As-Saodah. Hak cipta dilindungi.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                            <span>Dibuat dengan</span>
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            <span>untuk pendidikan Indonesia</span>
                        </div>
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
