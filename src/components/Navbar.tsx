'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/tentang', label: 'Tentang Kami' },
    { href: '/prestasi', label: 'Prestasi' },
    { href: '/informasi', label: 'Informasi' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    return (
        <>
            <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
                    ? 'glass shadow-lg shadow-emerald-900/5 border-b border-white/20'
                    : 'bg-transparent'
                }`}>
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-black text-lg">M</span>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-md flex items-center justify-center">
                                <span className="text-[8px] font-black text-amber-900">H</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-slate-900">MH As-Saodah</span>
                            <p className="text-[10px] font-semibold text-emerald-600 -mt-0.5 tracking-wider uppercase">Madrasah Ibtidaiyah</p>
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
                                    className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                                            ? 'text-emerald-700 bg-emerald-50'
                                            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/ppdb"
                            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-200 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Daftar PPDB
                        </Link>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-20 z-40 lg:hidden"
                    >
                        <div className="mx-4 rounded-2xl glass shadow-2xl border border-white/30 overflow-hidden">
                            <div className="p-4 space-y-1">
                                {navLinks.map(link => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block px-5 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                <Link
                                    href="/ppdb"
                                    className="block text-center mt-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg"
                                >
                                    Daftar PPDB Sekarang
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
