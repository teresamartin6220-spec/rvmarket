
-- Add columns to inquiries for email threading
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS resend_message_id text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS original_subject text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';

-- Create sent_emails table
CREATE TABLE public.sent_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  resend_message_id text,
  inquiry_id uuid REFERENCES public.inquiries(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sent_emails" ON public.sent_emails FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can view sent_emails" ON public.sent_emails FOR SELECT TO public USING (true);
