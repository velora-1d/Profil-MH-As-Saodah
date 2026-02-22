export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MH As-Saodah</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
            <a href="#profil" className="hover:text-emerald-600 transition-colors">Profil</a>
            <a href="#akademik" className="hover:text-emerald-600 transition-colors">Akademik</a>
            <a href="#fasilitas" className="hover:text-emerald-600 transition-colors">Fasilitas</a>
            <a href="#kontak" className="hover:text-emerald-600 transition-colors">Kontak</a>
          </div>
          <div>
            <a href="http://localhost:8000/login" className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
              Portal Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-widest">
                Pesantren & Sekolah Modern
              </span>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Membangun <span className="text-emerald-600">Generasi</span> Qur'ani & Berwawasan Global
              </h1>
              <p className="text-lg leading-8 text-slate-600 max-w-xl italic border-l-4 border-emerald-500 pl-6">
                "Pendidikan berkualitas dengan landasan akhlakul karimah untuk masa depan umat yang gemilang."
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                  Daftar Sekarang
                </button>
                <button className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 border-2 border-slate-100 hover:bg-slate-50 transition-all shadow-sm">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-200">
               {/* Decorative Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent z-10"></div>
               <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 z-20">
                  <p className="text-white text-sm font-medium italic">"Tempat terbaik untuk menimba ilmu dan memperdalam spiritualitas di era modern."</p>
               </div>
               <div className="h-full w-full bg-emerald-800 flex items-center justify-center text-emerald-400">
                  <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.7l6.3 5.7h-1.3v5.6h-10v-5.6H5.7L12 7.7z"/>
                  </svg>
               </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-600">1200+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Santri & Siswa</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-600">80+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tenaga Pendidik</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-600">15+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ekstrakurikuler</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-600">100%</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Lulusan Terbaik</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
