'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Image as ImageIcon,
  GraduationCap,
  ClipboardList,
  MessageSquareWarning,
  Star,
  FileText,
  Briefcase,
  Handshake,
  CalendarDays,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/admissions', label: 'Admissions', icon: ClipboardList },
  { href: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/staff', label: 'Staff & Leadership', icon: GraduationCap },
  { href: '/admin/calendar', label: 'Academic Calendar', icon: CalendarDays },
  { href: '/admin/tenders', label: 'Tenders', icon: FileText },
  { href: '/admin/vacancies', label: 'Vacancies', icon: Briefcase },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-6">
        <div className="font-serif text-base font-semibold text-canopy">
          Cliffside Motari
        </div>
        <div className="text-xs font-semibold tracking-wide text-mist">ADMIN</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`mb-0.5 flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-medium ${
                isActive ? 'bg-canopy text-white' : 'text-ink hover:bg-paper'
              }`}
            >
              <Icon size={17} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-medium text-mist hover:bg-paper"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
