-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'quote',
  status text NOT NULL DEFAULT 'new',
  name text NOT NULL,
  phone text,
  email text,
  vehicle text,
  tire_size text,
  message text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "staff read leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "staff update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "staff delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TRIGGER leads_touch_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Auto-promote the first user to admin so the site owner can save admin changes
CREATE OR REPLACE FUNCTION public.grant_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_first_admin();