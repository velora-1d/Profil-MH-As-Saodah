'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Image,
  Newspaper,
  Building2,
  Trophy,
  Users,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BookMarked,
  BarChart3,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hero Slides', href: '/admin/heroes', icon: Image },
  { label: 'Berita', href: '/admin/posts', icon: Newspaper },
  { label: 'Program Unggulan', href: '/admin/programs', icon: BookMarked },
  { label: 'Statistik', href: '/admin/stats', icon: BarChart3 },
  { label: 'Fasilitas', href: '/admin/facilities', icon: Building2 },
  { label: 'Prestasi', href: '/admin/achievements', icon: Trophy },
  { label: 'Guru', href: '/admin/teachers', icon: Users },
  { label: 'PPDB', href: '/admin/ppdb', icon: GraduationCap },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-2.5 rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 transition-all duration-300 flex flex-col
          ${collapsed ? 'w-20' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">As-Saodah</p>
                <p className="text-[10px] text-slate-500 mt-0.5">CMS Dashboard</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => {
              setCollapsed((c) => !c);
              setMobileOpen(false);
            }}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : collapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${isActive
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer — Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
