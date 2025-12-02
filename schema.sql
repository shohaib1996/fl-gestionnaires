-- CREATE TYPE project_status AS ENUM (
--   'submitted',
--   'received',
--   'retained',
--   'in_progress',
--   'rejected',
--   'completed'
-- );
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  parent_name TEXT,
  phone TEXT,
  email TEXT,
  project_city TEXT,
  residence_city TEXT,
  province TEXT,
  collaborators JSONB,
  title TEXT NOT NULL,
  description TEXT,
  categories TEXT [],
  phase TEXT,
  links TEXT [],
  signature TEXT,
  signer_name TEXT,
  logo_url TEXT,
  status project_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);