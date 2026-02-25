import Link from 'next/link';

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

export default function Footer() {
    return (
        <footer className="relative bg-slate-950 text-white overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-950/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-950/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg flex items-center justify-center">
                                <span className="text-white font-black text-xl">M</span>
                            </div>
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
                            {['facebook', 'instagram', 'youtube'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200">
                                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map(group => (
                        <div key={group.title}>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5">{group.title}</h4>
                            <ul className="space-y-3">
                                {group.links.map(link => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5">Kontak</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Jl. Contoh Alamat No. 123, Kota, Provinsi</span>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>info@mh-assaodah.sch.id</span>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>(021) xxxx-xxxx</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} MI MH As-Saodah. Hak cipta dilindungi.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                        <span>Dibuat dengan</span>
                        <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span>untuk pendidikan Indonesia</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
