import Link from 'next/link';
import { site } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-canopy-dark px-6 py-14 text-[#cfd9d3]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 border-b border-white/15 pb-9 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="font-serif text-lg font-semibold text-white">
            Cliffside Motari <span className="text-[#9fae9f]">ACADEMY</span>
          </div>
          <p className="mt-3 max-w-xs text-sm">
            A CBE academy on the hills of Manga, Nyamira County — technology-enhanced
            learning for confident, capable learners.
          </p>
        </div>
        <div>
          <h5 className="mb-4 text-sm tracking-wide text-white">EXPLORE</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/academics">Academics</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/news">News</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-4 text-sm tracking-wide text-white">OPPORTUNITIES</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/opportunities/tenders">Tenders</Link></li>
            <li><Link href="/opportunities/vacancies">Vacancies</Link></li>
            <li><Link href="/partners">Partners</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-4 text-sm tracking-wide text-white">INFORMATION</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/admissions">Admissions</Link></li>
            <li><Link href="/academic-calendar">Academic Calendar</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/complaints">Complaints</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-4 text-sm tracking-wide text-white">CONTACT</h5>
          <ul className="space-y-2 text-sm">
            <li>{site.phone}</li>
            <li>{site.email}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 pt-6 text-sm">
        <span>© {site.name} 2026</span>
        <span>
          <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
