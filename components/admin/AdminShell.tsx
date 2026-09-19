'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Desktop: static sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile: topbar */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3.5 md:hidden">
          <div className="font-serif text-base font-semibold text-canopy">
            Cliffside Motari <span className="font-sans text-xs font-semibold text-mist">ADMIN</span>
          </div>
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-canopy">
            <Menu size={26} />
          </button>
        </div>

        {/* Mobile: slide-in drawer */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-canopy-dark/45" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-surface shadow-lg">
              <div className="flex justify-end p-3">
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-canopy">
                  <X size={24} />
                </button>
              </div>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}
