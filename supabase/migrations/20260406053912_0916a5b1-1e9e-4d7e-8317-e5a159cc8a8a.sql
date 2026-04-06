ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.sent_emails ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;