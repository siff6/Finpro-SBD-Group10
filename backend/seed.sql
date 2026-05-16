Table users {
  user_id uuid [primary key]
  username text [not null]
  email text [unique, not null]
  password text
  created_at timestamptz [not null, default: `now()`]
}

Table companies {
  company_id uuid [primary key, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.user_id]
  company_name text [not null]
  website text [not null, default: '']
  industry text
  location text
  contact text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    user_id
    company_name
  }
}

Table job_applications {
  application_id uuid [primary key, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.user_id]
  company_id uuid [not null, ref: > companies.company_id]
  position text [not null]
  status text [not null, default: 'Applied', note: 'ENUM(Applied, Screening, Interviewed, Offer, Accepted, Rejected, Withdrawn)']
  application_date date [not null, default: `current_date`]
  salary integer [not null, default: 0, note: 'CHECK (salary >= 0)']
  job_type text [not null, default: 'Full-time', note: 'ENUM(Internship, Full-time, Part-time, Contract, Freelance)']
  source text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    user_id
    company_id
    status
    application_date
    job_type
  }
}

Table application_status_history {
  history_id uuid [primary key, default: `gen_random_uuid()`]
  application_id uuid [not null, ref: > job_applications.application_id]
  old_status text
  new_status text [not null, note: 'ENUM(Applied, Screening, Interviewed, Offer, Accepted, Rejected, Withdrawn)']
  changed_at timestamptz [not null, default: `now()`]
  note text

  Indexes {
    application_id
    changed_at
  }
}

Table reminders {
  reminder_id uuid [primary key, default: `gen_random_uuid()`]
  application_id uuid [not null, ref: > job_applications.application_id]
  user_id uuid [not null, ref: > users.user_id]
  reminder_type text [not null, note: 'ENUM(Interview, Follow-up, Deadline, Document, Other)']
  reminder_date timestamptz [not null]
  message text [not null]
  is_done boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    user_id
    application_id
    reminder_date
    is_done
  }
}

Table application_notes {
  note_id uuid [primary key, default: `gen_random_uuid()`]
  application_id uuid [not null, ref: > job_applications.application_id]
  user_id uuid [not null, ref: > users.user_id]
  note text [not null]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    application_id
    user_id
  }
}