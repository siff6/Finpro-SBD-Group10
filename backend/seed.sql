-- =========================================================
-- Applytics Database Schema + Seed Data
-- Final Project Sistem Basis Data - Group 10
-- Database: PostgreSQL
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- DROP TABLES
-- Urutan drop mengikuti dependency foreign key
-- =========================================================

drop table if exists public.application_notes cascade;
drop table if exists public.reminders cascade;
drop table if exists public.application_status_history cascade;
drop table if exists public.job_applications cascade;
drop table if exists public.companies cascade;
drop table if exists public.users cascade;

-- =========================================================
-- TABLE: users
-- =========================================================

create table public.users (
  user_id uuid primary key default gen_random_uuid(),
  username text not null,
  email text not null unique,
  password text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TABLE: companies
-- =========================================================

create table public.companies (
  company_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  company_name text not null,
  website text not null default '',
  industry text,
  location text,
  contact text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TABLE: job_applications
-- =========================================================

create table public.job_applications (
  application_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  company_id uuid not null references public.companies(company_id) on delete cascade,

  position text not null,

  status text not null default 'Applied'
    check (status in (
      'Applied',
      'Screening',
      'Interviewed',
      'Offer',
      'Accepted',
      'Rejected',
      'Withdrawn'
    )),

  application_date date not null default current_date,

  salary integer not null default 0
    check (salary >= 0),

  job_type text not null default 'Full-time'
    check (job_type in (
      'Internship',
      'Full-time',
      'Part-time',
      'Contract',
      'Freelance'
    )),

  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- TABLE: application_status_history
-- =========================================================

create table public.application_status_history (
  history_id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(application_id) on delete cascade,

  old_status text
    check (
      old_status is null or old_status in (
        'Applied',
        'Screening',
        'Interviewed',
        'Offer',
        'Accepted',
        'Rejected',
        'Withdrawn'
      )
    ),

  new_status text not null
    check (new_status in (
      'Applied',
      'Screening',
      'Interviewed',
      'Offer',
      'Accepted',
      'Rejected',
      'Withdrawn'
    )),

  changed_at timestamptz not null default now(),
  note text
);

-- =========================================================
-- TABLE: reminders
-- =========================================================

create table public.reminders (
  reminder_id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(application_id) on delete cascade,
  user_id uuid not null references public.users(user_id) on delete cascade,

  reminder_type text not null
    check (reminder_type in (
      'Interview',
      'Follow-up',
      'Deadline',
      'Document',
      'Other'
    )),

  reminder_date timestamptz not null,
  message text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TABLE: application_notes
-- =========================================================

create table public.application_notes (
  note_id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(application_id) on delete cascade,
  user_id uuid not null references public.users(user_id) on delete cascade,

  note text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index companies_user_id_idx
  on public.companies(user_id);

create index companies_company_name_idx
  on public.companies(company_name);

create index job_applications_user_id_idx
  on public.job_applications(user_id);

create index job_applications_company_id_idx
  on public.job_applications(company_id);

create index job_applications_status_idx
  on public.job_applications(status);

create index job_applications_application_date_idx
  on public.job_applications(application_date);

create index job_applications_job_type_idx
  on public.job_applications(job_type);

create index application_status_history_application_id_idx
  on public.application_status_history(application_id);

create index application_status_history_changed_at_idx
  on public.application_status_history(changed_at);

create index reminders_user_id_idx
  on public.reminders(user_id);

create index reminders_application_id_idx
  on public.reminders(application_id);

create index reminders_reminder_date_idx
  on public.reminders(reminder_date);

create index reminders_is_done_idx
  on public.reminders(is_done);

create index application_notes_application_id_idx
  on public.application_notes(application_id);

create index application_notes_user_id_idx
  on public.application_notes(user_id);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Catatan:
-- Password untuk semua akun demo adalah: password123
-- Password disimpan dalam bentuk bcrypt hash.

-- USERS
insert into public.users (user_id, username, email, password, created_at)
values
(
  '11111111-1111-1111-1111-111111111111',
  'Ziehan',
  'ziehan@example.com',
  '$2b$10$KYVbZ5JFVfqu0oV0rQb3E.KG5V5GEZIBxC6JYwRjzKsX9y2PfZkiC',
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'Demo User',
  'demo@example.com',
  '$2b$10$KYVbZ5JFVfqu0oV0rQb3E.KG5V5GEZIBxC6JYwRjzKsX9y2PfZkiC',
  now()
);

-- COMPANIES
insert into public.companies
(company_id, user_id, company_name, website, industry, location, contact, created_at)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'Tokopedia',
  'https://www.tokopedia.com',
  'Technology',
  'Jakarta',
  'hr@tokopedia.com',
  now()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'Gojek',
  'https://www.gojek.com',
  'Technology',
  'Jakarta',
  'recruitment@gojek.com',
  now()
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'Bank Mandiri',
  'https://www.bankmandiri.co.id',
  'Banking',
  'Jakarta',
  'career@bankmandiri.co.id',
  now()
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '11111111-1111-1111-1111-111111111111',
  'Shopee',
  'https://www.shopee.co.id',
  'E-Commerce',
  'Jakarta',
  'career@shopee.co.id',
  now()
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '22222222-2222-2222-2222-222222222222',
  'Traveloka',
  'https://www.traveloka.com',
  'Technology',
  'Tangerang',
  'career@traveloka.com',
  now()
);

-- JOB APPLICATIONS
insert into public.job_applications
(application_id, user_id, company_id, position, status, application_date, salary, job_type, source, created_at, updated_at)
values
(
  '10000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Backend Developer Intern',
  'Applied',
  current_date - interval '20 days',
  3000000,
  'Internship',
  'LinkedIn',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Software Engineer Intern',
  'Screening',
  current_date - interval '15 days',
  3500000,
  'Internship',
  'Company Website',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Data Analyst Intern',
  'Interviewed',
  current_date - interval '10 days',
  2800000,
  'Internship',
  'Jobstreet',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Frontend Developer',
  'Rejected',
  current_date - interval '7 days',
  6000000,
  'Full-time',
  'Glints',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Product Analyst',
  'Offer',
  current_date - interval '5 days',
  7000000,
  'Full-time',
  'Referral',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000006',
  '11111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'QA Engineer Intern',
  'Accepted',
  current_date - interval '2 days',
  3200000,
  'Internship',
  'LinkedIn',
  now(),
  now()
),
(
  '10000000-0000-0000-0000-000000000007',
  '22222222-2222-2222-2222-222222222222',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'UI/UX Designer Intern',
  'Applied',
  current_date - interval '3 days',
  2500000,
  'Internship',
  'LinkedIn',
  now(),
  now()
);

-- STATUS HISTORY
insert into public.application_status_history
(history_id, application_id, old_status, new_status, changed_at, note)
values
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000001',
  null,
  'Applied',
  current_date - interval '20 days',
  'Lamaran pertama kali dikirim melalui LinkedIn.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000002',
  null,
  'Applied',
  current_date - interval '15 days',
  'Lamaran dikirim melalui website perusahaan.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000002',
  'Applied',
  'Screening',
  current_date - interval '12 days',
  'CV sedang dalam proses screening oleh recruiter.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000003',
  null,
  'Applied',
  current_date - interval '10 days',
  'Lamaran dikirim melalui Jobstreet.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000003',
  'Applied',
  'Screening',
  current_date - interval '8 days',
  'Lolos tahap screening awal.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000003',
  'Screening',
  'Interviewed',
  current_date - interval '4 days',
  'Sudah mengikuti interview tahap pertama.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000004',
  null,
  'Applied',
  current_date - interval '7 days',
  'Lamaran dikirim melalui Glints.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000004',
  'Applied',
  'Rejected',
  current_date - interval '3 days',
  'Lamaran belum sesuai dengan kebutuhan posisi.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000005',
  null,
  'Applied',
  current_date - interval '5 days',
  'Lamaran dikirim melalui referral.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000005',
  'Applied',
  'Interviewed',
  current_date - interval '3 days',
  'Sudah mengikuti interview user.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000005',
  'Interviewed',
  'Offer',
  current_date - interval '1 day',
  'Mendapatkan offering dari perusahaan.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000006',
  null,
  'Applied',
  current_date - interval '2 days',
  'Lamaran dikirim melalui LinkedIn.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000006',
  'Applied',
  'Accepted',
  current_date,
  'Lamaran diterima dan user menyetujui posisi tersebut.'
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000007',
  null,
  'Applied',
  current_date - interval '3 days',
  'Lamaran dikirim oleh demo user.'
);

-- REMINDERS
insert into public.reminders
(reminder_id, application_id, user_id, reminder_type, reminder_date, message, is_done, created_at)
values
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'Follow-up',
  now() + interval '2 days',
  'Follow up hasil screening ke recruiter.',
  false,
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Interview',
  now() + interval '1 day',
  'Persiapkan materi untuk interview tahap kedua.',
  false,
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'Document',
  now() + interval '3 days',
  'Lengkapi dokumen administrasi untuk offering.',
  false,
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'Other',
  now() - interval '1 day',
  'Catat feedback dari proses rekrutmen.',
  true,
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000007',
  '22222222-2222-2222-2222-222222222222',
  'Follow-up',
  now() + interval '4 days',
  'Demo user follow up application.',
  false,
  now()
);

-- APPLICATION NOTES
insert into public.application_notes
(note_id, application_id, user_id, note, created_at)
values
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Perlu menyiapkan portfolio backend dan project API untuk posisi ini.',
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'Perlu follow up recruiter jika belum ada kabar setelah beberapa hari.',
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Interview membahas SQL, dashboard analytics, dan basic statistics.',
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'Perlu pertimbangkan offering, benefit, dan lokasi kerja.',
  now()
),
(
  gen_random_uuid(),
  '10000000-0000-0000-0000-000000000007',
  '22222222-2222-2222-2222-222222222222',
  'Catatan dummy untuk demo user.',
  now()
);
