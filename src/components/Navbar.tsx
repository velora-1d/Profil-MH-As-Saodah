'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Home, Info, Trophy, Newspaper, ChevronRight } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/tentang', label: 'Tentang Kami', icon: Info },
    { href: '/prestasi', label: 'Prestasi', icon: Trophy },
    { href: '/informasi', label: 'Informasi', icon: Newspaper },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100'
                    : 'bg-transparent'
                    }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25 flex items-center justify-center"
                        >
                            <span className="text-white font-black text-lg">M</span>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-md flex items-center justify-center">
                                <span className="text-[8px] font-black text-amber-900">H</span>
                            </div>
                        </motion.div>
                        <div>
                            <span className={`text-lg font-black tracking-tight transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                MH As-Saodah
                            </span>
                            <p className={`text-[10px] font-semibold -mt-0.5 tracking-wider uppercase transition-colors duration-300 ${scrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>
                                Madrasah Ibtidaiyah
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                            ? scrolled
                                                ? 'text-emerald-700 bg-emerald-50'
                                                : 'text-white bg-white/15 backdrop-blur-sm'
                                            : scrolled
                                                ? 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {link.label}
                                    </motion.div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${scrolled ? 'bg-emerald-600' : 'bg-white'}`}
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <Link href="/ppdb">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow duration-300"
                            >
                                <GraduationCap className="w-4 h-4" />
                                Daftar PPDB
                            </motion.div>
                        </Link>
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`lg:hidden p-2.5 rounded-xl transition-colors duration-300 ${scrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-white'}`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                                        <span className="text-white font-black">M</span>
                                    </div>
                                    <div>
                                        <span className="text-base font-black text-slate-900">MH As-Saodah</span>
                                        <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">Madrasah Ibtidaiyah</p>
                                    </div>
                                </div>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                                    <X className="w-5 h-5 text-slate-500" />
                                </motion.button>
                            </div>

                            <div className="p-6 space-y-2">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive
                                                    ? 'text-emerald-700 bg-emerald-50 shadow-sm'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive
                                                    ? 'bg-emerald-500 text-white shadow-md'
                                                    : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    <link.icon className="w-5 h-5" />
                                                </div>
                                                <span className="flex-1">{link.label}</span>
                                                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-300'}`} />
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="pt-4"
                                >
                                    <Link
                                        href="/ppdb"
                                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
                                    >
                                        <GraduationCap className="w-5 h-5" />
                                        Daftar PPDB Sekarang
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
