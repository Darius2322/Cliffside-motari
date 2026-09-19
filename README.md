# Cliffside Motari Academy — Website Rebuild

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase for the CMA
public website and admin dashboard, built from the approved design system
and a content audit of the live site (cliffsidemotariacademy.com).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

You need a Supabase project before most of this works (forms, news, admin
login all depend on it). See "Setting up Supabase" below.

## Setting up Supabase

1. Create a project at supabase.com.
2. In the SQL Editor, paste and run `supabase/migrations/0001_init.sql` —
   this creates every table and RLS policy the site needs.
3. In Storage, create these buckets (see the bottom of the migration file
   for the full list and public/private split): `gallery`, `staff-photos`,
   `resources` (public), `admissions-private`, `complaints-private`,
   `tenders-private` (private).
4. Copy your Project URL, anon key, and service role key from
   Settings → API into `.env.local` (see `.env.example`).
5. Create your first admin login: in Supabase Auth, add a user (email +
   password). Then in the SQL Editor:
   ```sql
   insert into admin_users (id, full_name, role)
   values ('<paste the user's UUID from Auth>', 'Your Name', 'super_admin');
   ```
   You can now sign in at `/admin/login`.

## What's here

### Public site
Every route is real content pulled from `lib/content.ts` (hardcoded, real,
verified) or from Supabase (dynamic — news, reviews, tenders, etc.). Nothing
here is invented; sections with no verified content show an honest
"pending" notice instead of placeholder text.

- `/` `/about` `/academics` `/gallery` `/contact` — as before.
- `/news`, `/news/[slug]` — reads published posts from `news_posts`.
- `/academic-calendar` — reads `academic_calendar_events`.
- `/reviews` — public approved reviews + a moderated submission form.
- `/complaints` — submission form, generates a `CMA-CMP-2026-XXXXX`
  reference.
- `/opportunities`, `/opportunities/tenders`, `/opportunities/vacancies` —
  reads `tenders` / `vacancies`.
- `/partners` — reads `partners`.
- `/resources` — reads `resources` (public downloadable documents).
- `/admissions` — the real multi-step stepper (fields taken from the live
  system at cliffsidemotariacademy.com/online_admission), now wired to a
  server action that uploads files to Supabase Storage and inserts into
  `admissions`, generating a real `CMA-2026-XXXXX` reference.
- `/admissions/status` — looks up an application by reference number + DOB.
- `/privacy`, `/terms`.
- A site-wide `AnnouncementBar` (reads `announcements`) sits above the
  header on every public page when something is published.

All public pages live under `app/(public)/` sharing one layout
(`app/(public)/layout.tsx`) with the header/footer/announcement bar. The
root `app/layout.tsx` is now just fonts + global metadata, so the admin
section doesn't inherit the public site's chrome.

### Admin dashboard (`/admin`)
- `/admin/login` — Supabase Auth email/password sign-in.
- Everything else under `/admin` requires both a valid Supabase session
  *and* a matching row in `admin_users` — enforced in `middleware.ts`, not
  just in the UI.
- `/admin` — overview with live counts (new admissions, pending reviews,
  open complaints, draft news, open vacancies).
- `/admin/news`, `/admin/news/new`, `/admin/news/[id]` — full CRUD:
  create, edit, publish/unpublish, delete, audit logged.
- `/admin/admissions`, `/admin/admissions/[id]` — full list + detail view
  with guardian info, signed links to uploaded photos/documents (private
  storage, 10-minute expiry), and a status control (Received → Under
  Review → Shortlisted → Accepted/Declined → Completed), audit logged.
- `/admin/complaints` — expandable rows per complaint with a status
  control (Received → Under Review → In Progress → Resolved), audit
  logged.
- `/admin/reviews` — moderation cards: Approve / Reject / Feature /
  Delete, audit logged. Approved reviews immediately show on the public
  `/reviews` page.
- **`/admin/gallery`** — upload a photo (with description + category),
  see it appear in a grid, delete any photo. Uploads go to the `gallery`
  Storage bucket and the row lands in `gallery_images`. The public
  `/gallery` page and homepage teaser now read from this table via
  `lib/actions/gallery.ts`'s `getGalleryImages()` — and fall back to the
  original real launch photos automatically if the table is still empty,
  so the site never shows a blank gallery.
- **`/admin/staff`** — add staff/leadership (photo, name, position,
  department, bio), toggle visible/hidden, delete. The public `/about`
  page's Leadership & Staff section now reads from this table — shows the
  honest "pending" notice only until the first person is added here.
- **`/admin/calendar`** — add/delete academic calendar events (term dates,
  holidays, exams, etc.), feeds `/academic-calendar` directly.
- **`/admin/tenders`**, **`/admin/vacancies`** — full create/edit/delete,
  status control, internal-vs-external application mode, feed the public
  `/opportunities/tenders` and `/opportunities/vacancies` pages.
- **`/admin/partners`** — add a partner with logo upload, toggle
  visible/hidden, delete, feeds `/partners`.

**All 10 admin sections are now fully built**: News, Admissions,
Complaints, Reviews, Gallery, Staff & Leadership, Academic Calendar,
Tenders, Vacancies, Partners.

### Database (`supabase/migrations/0001_init.sql`)
One file, every table: `admin_users`, `admissions`, `contact_messages`,
`complaints`, `reviews`, `news_posts`, `announcements`,
`academic_calendar_events`, `tenders`, `tender_applications`, `vacancies`,
`vacancy_applications`, `partners`, `gallery_images`, `staff_members`,
`resources`, `audit_logs`, `site_settings`. RLS is on for every table:
public can insert into forms but never read them back; public can read
published/approved/visible content; only rows in `admin_users` can read or
write privileged data. Storage bucket setup is documented at the bottom of
the file (SQL can't create buckets — do that in the dashboard).

### SEO / PWA
- `app/sitemap.ts`, `app/robots.ts` — dynamic, cover every public route.
- `EducationalOrganization` JSON-LD in the root layout `<head>`.
- Open Graph metadata, `metadataBase`, theme color.
- `public/manifest.json` for PWA installability. **Still needed:** real
  `icon-192.png` / `icon-512.png` exported from the actual CMA logo — I
  couldn't fetch the logo's raw pixels, so these files don't exist yet and
  the manifest references them without them being present.

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

Fonts: **Spectral** (serif, headlines) + **Public Sans** (UI/body) via
`next/font/google`. **Still not verified against the actual logo file** —
built from the school's real photography/setting, not the logo's pixels.
Check against the real logo before this goes fully live.

## Honestly not done yet

Also done since the last update: mobile-responsive admin (topbar +
slide-in drawer, matching the public site's pattern), real PWA icons
(`public/icon-192.png` / `icon-512.png` — on-brand placeholder monogram,
swap for the real logo when available), and working public application
forms for tenders and vacancies (`tender_applications` /
`vacancy_applications` now actually receive submissions, not just an
"Apply Now" link with nowhere to go).

- **Leadership, Staff, School History, detailed per-level curriculum** —
  can't be pre-filled without the school providing real names/bios/photos/
  text, but `/admin/staff` is now built, so adding real people is a form
  away — they'll show on `/about` immediately.
- **Rich text editor** (Tiptap, per the brief) for news body — still
  plain text in a textarea. Deliberately deferred: adding a new dependency
  right now risks another build failure, and plain text works fine
  functionally. Worth doing once the site is stable and deploying cleanly.
- **File-upload UI in admin** for tender/vacancy supporting documents —
  gallery, partner logo, and staff photo uploads are all done; same
  pattern still needs repeating for tender/vacancy attachments specifically.
- **Real data migration** from the existing PHP/MySQL system — this is a
  brand new, empty Supabase project. Nothing from the live site's database
  has been migrated. Back up the current database before any real cutover.

## Notes on hosting/migration

The current live site at cliffsidemotariacademy.com runs on what appears
to be a PHP school-management system on shared/cPanel hosting — not this
stack. This project is a parallel rebuild (deployed separately at
cliffside-motari.vercel.app), not an in-place refactor of the live site.
