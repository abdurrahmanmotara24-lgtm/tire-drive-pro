
-- Lead pipeline + notes
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes text;

ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'contacted';
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'booked';
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'lost';

UPDATE public.leads SET status = 'contacted' WHERE status = 'read';
