
CREATE TYPE public.lead_type AS ENUM ('quote', 'contact');
CREATE TYPE public.lead_status AS ENUM ('new', 'read', 'archived');

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.lead_type NOT NULL,
  status public.lead_status NOT NULL DEFAULT 'new',
  name text NOT NULL,
  phone text,
  email text,
  vehicle text,
  tire_size text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "staff read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "staff update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_status_idx ON public.leads (status);
