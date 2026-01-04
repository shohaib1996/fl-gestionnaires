-- Schema for admin_account_requests table
-- This is for admin account requests with no financial or occupation information

CREATE TABLE public.admin_account_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  postnom TEXT,
  birth_date TEXT NOT NULL,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Identification
  id_type TEXT[] NOT NULL,
  other_id_type TEXT,
  id_number TEXT,
  id_front_image TEXT, -- Supabase Storage URL
  id_back_image TEXT,  -- Supabase Storage URL

  -- Compliance
  terms_accepted BOOLEAN DEFAULT false,
  privacy_accepted BOOLEAN DEFAULT false,

  -- Signature
  signature_url TEXT,  -- stored in Storage, not DB base64
  signer_name TEXT,

  -- System fields
  user_id TEXT NOT NULL, -- reference to auth user
  status TEXT DEFAULT 'pending', -- pending / approved / rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE public.admin_account_requests ENABLE ROW LEVEL SECURITY;

-- Example policy: Admins can see all requests
-- CREATE POLICY "Admins can view all admin account requests"
--   ON public.admin_account_requests
--   FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');
