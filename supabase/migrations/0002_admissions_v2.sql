-- Cliffside Motari Academy — admissions v2 schema
-- Rebuilds `admissions` with the expanded field set (transfer, medical,
-- no student contact fields) and splits guardians into their own table
-- (an application can have 1–2 guardians). Safe to drop-and-recreate here
-- because this project has no real submitted applications yet — if you
-- ever run this against a table with real data, write a proper ALTER/
-- migrate-data version instead of dropping.

drop table if exists admission_guardians cascade;
drop table if exists admissions cascade;

create table admissions (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,

  -- Learner
  first_name text not null,
  middle_name text,
  last_name text not null,
  date_of_birth date not null,
  gender text not null,
  previous_school text,
  student_class text not null,
  stream text,
  student_photo_path text,

  -- Transfer
  is_transferring boolean not null default false,
  transfer_school_name text,
  transfer_school_location text,
  transfer_reason text,

  -- Medical
  allergies text,
  medical_conditions text,
  has_disability boolean not null default false,
  disability_details text,
  other_medical_notes text,

  -- Documents (paths + labels kept parallel; simplest shape for now)
  document_paths text[],

  -- Status / workflow
  status text not null default 'Submitted'
    check (status in ('Submitted', 'Under Review', 'Approved', 'Rejected', 'Additional Information Required')),

  -- Filled in on approval — admin approval UI is a follow-up build, but
  -- the columns exist now so that work doesn't need another migration.
  admission_number text,
  report_purpose text check (report_purpose in ('Interview', 'Reporting')),
  report_date date,
  admission_requirements text,

  created_at timestamptz not null default now()
);

alter table admissions enable row level security;

create policy "Anyone can submit an admission"
  on admissions for insert
  with check (true);

create policy "Admins can read admissions"
  on admissions for select
  using (auth.uid() in (select id from admin_users));

create policy "Admins can update admissions"
  on admissions for update
  using (auth.uid() in (select id from admin_users));

-- Guardians: 1–2 per application. Enforced in the application form (must
-- submit at least one); not enforced at the DB level with a trigger here
-- to keep this migration simple.
create table admission_guardians (
  id uuid primary key default gen_random_uuid(),
  admission_id uuid not null references admissions(id) on delete cascade,
  guardian_order smallint not null check (guardian_order in (1, 2)),
  full_name text not null,
  relationship text not null,
  primary_phone text not null,
  secondary_phone text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  unique (admission_id, guardian_order)
);

alter table admission_guardians enable row level security;

create policy "Anyone can submit guardians with an admission"
  on admission_guardians for insert
  with check (true);

create policy "Admins can read guardians"
  on admission_guardians for select
  using (auth.uid() in (select id from admin_users));

-- Status-check (reference number + DOB) continues to go through a
-- service-role server action, never a direct anonymous SELECT.
