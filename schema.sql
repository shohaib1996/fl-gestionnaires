-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums & Types
CREATE TYPE project_status AS ENUM ('submitted', 'received', 'retained', 'in_progress', 'rejected', 'completed');
CREATE TYPE user_role AS ENUM ('entrepreneur', 'admin', 'manager');

-- 2. Profiles Table (Public User Data)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'entrepreneur',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  residence_city TEXT,
  province TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (new.id, new.email, 'entrepreneur', new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Projects Table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entrepreneur_id UUID REFERENCES public.profiles(id) NOT NULL,
  code TEXT UNIQUE, -- Generated ID like FL-2025-001
  status project_status DEFAULT 'submitted',
  
  -- Project Details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  phase TEXT,
  logo_url TEXT,
  
  -- Location
  location_city TEXT,
  location_province TEXT,
  
  -- Links
  website_url TEXT,
  social_links JSONB, 
  
  -- Admin Assignment
  assigned_admins UUID[], -- Array of Profile IDs
  
  -- Scores
  scores JSONB, 
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Collaborators Table
CREATE TABLE public.collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  role TEXT,
  city TEXT,
  province TEXT
);

-- 5. Evaluations & Notes
CREATE TABLE public.evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id),
  type TEXT CHECK (type IN ('note', 'evaluation', 'request_info')),
  content TEXT,
  score INTEGER,
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tasks & Appointments
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Date & Time
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  
  -- Location & Participants
  location TEXT,
  participant_name TEXT,
  
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Contacts Directory
CREATE TABLE public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES public.profiles(id),
  
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  skills TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --- RLS POLICIES ---

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Helper Function
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins/Managers view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_manager());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Entrepreneurs view own projects" ON public.projects FOR SELECT USING (auth.uid() = entrepreneur_id);
CREATE POLICY "Entrepreneurs create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = entrepreneur_id);
CREATE POLICY "Entrepreneurs update own projects" ON public.projects FOR UPDATE USING (auth.uid() = entrepreneur_id);
CREATE POLICY "Staff view all projects" ON public.projects FOR SELECT USING (public.is_admin_or_manager());
CREATE POLICY "Staff update all projects" ON public.projects FOR UPDATE USING (public.is_admin_or_manager());

-- Tasks Policies
CREATE POLICY "Users manage own tasks" ON public.tasks USING (auth.uid() = created_by);

-- Contacts Policies
CREATE POLICY "Staff manage contacts" ON public.contacts USING (public.is_admin_or_manager());
