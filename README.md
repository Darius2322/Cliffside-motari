# Cliffside Motari Academy — Website Rebuild

Next.js 14 (App Router) + TypeScript + Tailwind CSS starter for the CMA public
website, built from the approved design system and content audit of the live
site (cliffsidemotariacademy.com).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

## What's here

- `app/` — one route per page: `/`, `/about`, `/academics`, `/gallery`,
  `/contact`, `/admissions`. All App Router, server components by default.
- `components/Header.tsx` — sticky nav + mobile drawer (client component).
- `components/GalleryGrid.tsx` — the 2-column mobile / 3-column desktop
  masonry gallery with scroll-reveal and a click-to-lightbox. Uses plain
  `<img>` instead of `next/image` deliberately — masonry needs each photo's
  natural aspect ratio, which fights `next/image`'s fixed-dimension model.
- `components/ContactForm.tsx` — React Hook Form + Zod validated form
  (the stack the spec calls for). Submission is currently client-only
  (`console.log` + fake delay) — see "Next steps" below.
- `lib/content.ts` — every piece of real, verified CMA copy and photo URL
  used across the site, in one place. Nothing here is invented. Sections
  with no verified content (school history, leadership, staff bios,
  detailed curriculum, gallery categories) are intentionally left out of
  this file and shown as an honest "pending" notice on the page instead of
  placeholder/lorem-ipsum text.
- `tailwind.config.ts` — the full design token set (colors, fonts) as
  Tailwind theme extensions, so `bg-canopy`, `text-loam`, `font-serif`, etc.
  are available everywhere.

## Design system

| Token | Hex | Use |
|---|---|---|
| `canopy` | `#23483A` | primary — nav, headings, buttons |
| `canopy-dark` | `#16302A` | hover/pressed states |
| `loam` | `#B6772E` | single accent — CTAs, one graphic motif only |
| `paper` | `#F2F0E6` | page background |
| `surface` | `#FFFFFF` | cards/panels |
| `mist` | `#6B7268` | secondary text |
| `border` | `#DAD6C8` | hairline dividers |

Fonts: **Spectral** (serif, headlines) + **Public Sans** (UI/body), loaded
via `next/font/google` in `app/layout.tsx` — no layout shift, no external
font requests at runtime.

**Not yet verified against the actual logo file** — the palette was built
from the school's real photography and setting (Manga, Nyamira County
hills), not sampled from the logo's pixels, since the logo asset wasn't
directly accessible. Check it against the real CMA logo and adjust hex
values if needed before this goes live.

## Content accuracy

Per the project brief: nothing on this site is invented. Real, verified
content (mission, vision, "why choose us," the four CBE programs, contact
info, and real campus photography) is wired in from `lib/content.ts`.
Anything not yet confirmed by the school (history, leadership, staff,
detailed per-subject curriculum, gallery categories) is shown as a visible
"pending" notice rather than placeholder text, so nobody mistakes it for
real content.

## Next steps (not built yet)

In priority order, per the original brief:

1. **Supabase schema + RLS policies** — tables for admissions, complaints,
   reviews, news, events, academic calendar, tenders, vacancies, partners,
   gallery images. None of this exists yet; `lib/content.ts` is a stand-in
   for what will become server-side data fetches.
2. **Admission multi-step stepper** — Parent/Guardian → Learner → Academic
   Placement → Additional Info → Review → Submission, with the *exact*
   fields from the current (Smart School–style PHP) admission system
   preserved. Needs the current system's field list before building —
   don't guess.
3. **Admin app** (`admin.cliffsidemotariacademy.com`) — separate
   authenticated Next.js app or route group, RBAC + audit logs.
4. **Wire `ContactForm` to a server action** that writes to Supabase or
   sends an email, replacing the current `console.log` stub.
5. **Migrate real data** from the existing PHP/MySQL system — back up
   first, verify the schema, write migrations, never reset production data.

## Notes on hosting/migration

The current live site runs on what appears to be a PHP school-management
system (likely a "Smart School"-style product) on shared/cPanel hosting —
not the Next.js/Supabase stack this project targets. Moving to this stack
is a full rebuild with a real data migration, not an in-place refactor.
Back up the current database and uploaded files before any cutover.
