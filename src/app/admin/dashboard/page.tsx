import { db } from '@/db';
import { webHeroes, webPosts, webFacilities, webAchievements, webTeachers, ppdbRegistrations, contactMessages } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { Newspaper, Image, Building2, Trophy, Users, GraduationCap, Mail, Clock } from 'lucide-react';

async function getStats() {
  const [
    [postsCount], 
    _unused1, 
    _unused2, 
    [achievementsCount], 
    [teachersCount], 
    [ppdbCount],
    [ppdbPendingCount],
    [unreadMessagesCount]
  ] = await Promise.all([
    db.select({ value: count() }).from(webPosts),
    db.select({ value: count() }).from(webHeroes),
    db.select({ value: count() }).from(webFacilities),
    db.select({ value: count() }).from(webAchievements),
    db.select({ value: count() }).from(webTeachers),
    db.select({ value: count() }).from(ppdbRegistrations),
    db.select({ value: count() }).from(ppdbRegistrations).where(eq(ppdbRegistrations.status, 'pending')),
    db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.isRead, false)),
  ]);

  return [
    { label: 'Pesan Baru', value: unreadMessagesCount.value, icon: 'Mail', color: 'from-blue-500 to-cyan-600', href: '/admin/messages' },
    { label: 'PPDB Pending', value: ppdbPendingCount.value, icon: 'Clock', color: 'from-amber-500 to-yellow-600', href: '/admin/ppdb' },
    { label: 'Total Pendaftar', value: ppdbCount.value, icon: 'GraduationCap', color: 'from-emerald-500 to-teal-600', href: '/admin/ppdb' },
    { label: 'Berita', value: postsCount.value, icon: 'Newspaper', color: 'from-indigo-500 to-blue-600', href: '/admin/posts' },
    { label: 'Guru', value: teachersCount.value, icon: 'Users', color: 'from-rose-500 to-pink-600', href: '/admin/teachers' },
    { label: 'Prestasi', value: achievementsCount.value, icon: 'Trophy', color: 'from-orange-500 to-amber-600', href: '/admin/achievements' },
  ];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Image, Newspaper, Building2, Trophy, Users, GraduationCap, Mail, Clock
};


export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Ringkasan konten website MI MH As-Saodah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative glow */}
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Kelola →
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Tambah Berita', href: '/admin/posts?action=create', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'Tambah Guru', href: '/admin/teachers?action=create', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
            { label: 'Tambah Prestasi', href: '/admin/achievements?action=create', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
            { label: 'Pengaturan Web', href: '/admin/settings', color: 'bg-slate-50 text-slate-700 hover:bg-slate-100' },
          ].map((a) => (
            <a key={a.label} href={a.href} className={`px-4 py-3 rounded-xl text-sm font-semibold text-center transition-colors ${a.color}`}>
              + {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
