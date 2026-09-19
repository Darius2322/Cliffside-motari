-- Cliffside Motari Academy — full schema
-- Run this in Supabase SQL Editor (or via the Supabase CLI / MCP) once,
-- against a fresh project. Idempotent-ish: uses IF NOT EXISTS where possible,
-- but re-running policy blocks will error on duplicates — drop first if
-- iterating.

create extension if not exists "pgcrypto";

-- ============================================================
-- ADMIN USERS / ROLES
-- ============================================================
-- Roles are looked up server-side only — never trust a role claim from the
-- client. This table maps an authenticated Supabase Auth user to a role.
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('super_admin', 'administrator', 'staff')),
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

create policy "Admins can read admin_users"
  on admin_users for select
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- ADMISSIONS
-- ============================================================
create table if not exists admissions (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  student_class text not null,
  stream text,
  first_name text not null,
  last_name text,
  gender text not null,
  date_of_birth date not null,
  mobile_number text,
  email text not null,
  student_photo_path text,
  guardian_is text not null,
  guardian_name text not null,
  guardian_relation text not null,
  guardian_email text,
  guardian_photo_path text,
  guardian_phone text,
  guardian_occupation text,
  guardian_address text,
  document_paths text[],
  status text not null default 'Received'
    check (status in ('Received', 'Under Review', 'Shortlisted', 'Accepted', 'Declined', 'Completed')),
  created_at timestamptz not null default now()
);

alter table admissions enable row level security;

-- Public can insert (submit an application) but never read the table back.
create policy "Anyone can submit an admission"
  on admissions for insert
  with check (true);

create policy "Admins can read admissions"
  on admissions for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update admissions"
  on admissions for update
  using (auth.uid() in (select id from admin_users));

-- Status-check endpoint (reference number + DOB) must be a server-side
-- function/route using the service role — never expose admissions rows
-- directly to anonymous SELECT.

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on contact_messages for insert
  with check (true);

create policy "Admins can read contact messages"
  on contact_messages for select
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- COMPLAINTS
-- ============================================================
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  category text not null
    check (category in ('Academics', 'Administration', 'Facilities', 'Staff', 'Student Welfare', 'Transport', 'Other')),
  full_name text not null,
  email text,
  phone text,
  description text not null,
  status text not null default 'Received'
    check (status in ('Received', 'Under Review', 'In Progress', 'Resolved')),
  created_at timestamptz not null default now()
);

alter table complaints enable row level security;

create policy "Anyone can submit a complaint"
  on complaints for insert
  with check (true);

create policy "Admins can read complaints"
  on complaints for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update complaints"
  on complaints for update
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship text not null,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null,
  photo_path text,
  status text not null default 'Pending'
    check (status in ('Pending', 'Approved', 'Rejected')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

create policy "Anyone can submit a review"
  on reviews for insert
  with check (true);

create policy "Anyone can read approved reviews"
  on reviews for select
  using (status = 'Approved');

create policy "Admins can read all reviews"
  on reviews for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update reviews"
  on reviews for update
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- NEWS
-- ============================================================
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null,
  featured_image_path text,
  category text
    check (category in ('Academic', 'School News', 'Events', 'Sports', 'Music', 'Announcements', 'Community')),
  author text,
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table news_posts enable row level security;

create policy "Anyone can read published news"
  on news_posts for select
  using (status = 'Published');

create policy "Admins can manage news"
  on news_posts for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- ANNOUNCEMENTS (site-wide notice bar)
-- ============================================================
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  priority text not null default 'Normal' check (priority in ('Normal', 'High')),
  start_date date,
  end_date date,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

create policy "Anyone can read published announcements"
  on announcements for select
  using (published = true);

create policy "Admins can manage announcements"
  on announcements for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- ACADEMIC CALENDAR
-- ============================================================
create table if not exists academic_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text not null
    check (event_type in ('Term', 'Opening Date', 'Closing Date', 'Half Term', 'Exam', 'Holiday', 'Other')),
  start_date date not null,
  end_date date,
  description text,
  created_at timestamptz not null default now()
);

alter table academic_calendar_events enable row level security;

create policy "Anyone can read calendar events"
  on academic_calendar_events for select
  using (true);

create policy "Admins can manage calendar events"
  on academic_calendar_events for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- TENDERS
-- ============================================================
create table if not exists tenders (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  title text not null,
  description text not null,
  eligibility text,
  opening_date date not null,
  closing_date date not null,
  status text not null default 'Open'
    check (status in ('Open', 'Closing Soon', 'Closed', 'Awarded', 'Archived')),
  application_mode text not null default 'internal' check (application_mode in ('internal', 'external')),
  external_url text,
  document_paths text[],
  contact_info text,
  created_at timestamptz not null default now()
);

alter table tenders enable row level security;

create policy "Anyone can read tenders"
  on tenders for select
  using (true);

create policy "Admins can manage tenders"
  on tenders for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create table if not exists tender_applications (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references tenders(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  document_paths text[],
  created_at timestamptz not null default now()
);

alter table tender_applications enable row level security;

create policy "Anyone can submit a tender application"
  on tender_applications for insert
  with check (true);

create policy "Admins can read tender applications"
  on tender_applications for select
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- VACANCIES
-- ============================================================
create table if not exists vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text,
  location text,
  employment_type text,
  description text not null,
  responsibilities text,
  requirements text,
  closing_date date not null,
  status text not null default 'Open' check (status in ('Open', 'Closed', 'Archived')),
  application_mode text not null default 'internal' check (application_mode in ('internal', 'external')),
  external_url text,
  created_at timestamptz not null default now()
);

alter table vacancies enable row level security;

create policy "Anyone can read vacancies"
  on vacancies for select
  using (true);

create policy "Admins can manage vacancies"
  on vacancies for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create table if not exists vacancy_applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid not null references vacancies(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  cv_path text,
  cover_note text,
  created_at timestamptz not null default now()
);

alter table vacancy_applications enable row level security;

create policy "Anyone can submit a vacancy application"
  on vacancy_applications for insert
  with check (true);

create policy "Admins can read vacancy applications"
  on vacancy_applications for select
  using (auth.uid() in (select id from admin_users));

-- ============================================================
-- PARTNERS
-- ============================================================
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_path text,
  website_url text,
  category text,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table partners enable row level security;

create policy "Anyone can read visible partners"
  on partners for select
  using (visible = true);

create policy "Admins can manage partners"
  on partners for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- GALLERY (replacing the hardcoded array in lib/content.ts)
-- ============================================================
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text not null,
  category text
    check (category in ('School Life', 'Academics', 'Sports', 'Music', 'Events', 'Graduation', 'Facilities', 'Students', 'Staff', 'Community')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_images enable row level security;

create policy "Anyone can read gallery images"
  on gallery_images for select
  using (true);

create policy "Admins can manage gallery images"
  on gallery_images for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- STAFF & LEADERSHIP
-- ============================================================
create table if not exists staff_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,
  department text,
  bio text,
  photo_path text,
  is_leadership boolean not null default false,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table staff_members enable row level security;

create policy "Anyone can read visible staff"
  on staff_members for select
  using (visible = true);

create policy "Admins can manage staff"
  on staff_members for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- RESOURCES (public downloadable documents)
-- ============================================================
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_path text not null,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table resources enable row level security;

create policy "Anyone can read resources"
  on resources for select
  using (true);

create policy "Admins can manage resources"
  on resources for all
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- AUDIT LOGS
-- ============================================================
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admin_users(id),
  action text not null,
  resource text not null,
  resource_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;

create policy "Admins can read audit logs"
  on audit_logs for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can insert audit logs"
  on audit_logs for insert
  with check (auth.uid() in (select id from admin_users));

-- ============================================================
-- SITE SETTINGS (singleton row: contact info, social links, etc.)
-- ============================================================
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  phone text,
  email text,
  address text,
  facebook_url text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "Anyone can read site settings"
  on site_settings for select
  using (true);

create policy "Admins can update site settings"
  on site_settings for update
  using (auth.uid() in (select id from admin_users));

insert into site_settings (id, phone, email, address)
values (1, '+254 117 225 220', 'info@cliffsidemotariacademy.com', 'Manga, Nyamira County, Kenya')
on conflict (id) do nothing;

-- ============================================================
-- STORAGE BUCKETS (run separately — Storage API, not SQL, but noted here)
-- ============================================================
-- Create these buckets in the Supabase dashboard (Storage tab):
--   gallery            (public)   — gallery photos
--   staff-photos        (public)   — staff/leadership photos
--   resources           (public)   — downloadable public documents
--   admissions-private  (private)  — student/guardian photos, application docs
--   complaints-private  (private)  — any complaint attachments
--   tenders-private     (private)  — tender application documents
-- For the private buckets, access only via signed URLs generated server-side
-- with the service role key — never make them public.
