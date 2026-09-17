'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { nav } from '@/lib/content';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // close the drawer automatically on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg font-semibold text-canopy">
          Cliffside Motari
          <span className="mt-0.5 block font-sans text-[0.62rem] font-semibold tracking-[0.14em] text-mist">
            ACADEMY
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium hover:text-canopy ${
                    pathname === item.href
                      ? 'border-b-2 border-loam pb-1 text-canopy'
                      : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/admissions"
          className="hidden rounded-sm bg-canopy px-5 py-2.5 text-sm font-semibold text-white hover:bg-canopy-dark md:inline-block"
        >
          Apply for Admission
        </Link>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="text-canopy md:hidden"
        >
          <Menu size={28} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-canopy-dark/45"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col gap-6 overflow-y-auto bg-surface p-6 shadow-lg">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="self-end text-canopy"
            >
              <X size={28} />
            </button>
            <ul className="flex flex-col gap-5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-lg font-medium ${
                      pathname === item.href ? 'font-bold text-canopy' : 'text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/admissions"
              className="mt-1 rounded-sm bg-loam py-3 text-center font-semibold text-white"
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
