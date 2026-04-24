import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Paksa semua halaman admin jadi dynamic — cegah SSG saat build di Vercel
// (Vercel tidak bisa konek ke PostgreSQL VPS saat build time)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: 'CMS Dashboard — MI MH As-Saodah',
    template: '%s | CMS As-Saodah',
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="lg:ml-72 transition-all duration-300">
          {/* Top header */}
          <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6">
            <div className="pl-12 lg:pl-0">
              <h2 className="text-sm font-semibold text-slate-700">
                Selamat Datang, <span className="text-emerald-600">{session.user.name}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
