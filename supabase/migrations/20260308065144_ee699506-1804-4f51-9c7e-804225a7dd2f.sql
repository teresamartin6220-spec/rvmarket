
-- Create table for RV listings
CREATE TABLE public.rv_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2024,
  stock_number TEXT,
  vin TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  mileage INTEGER NOT NULL DEFAULT 0,
  sleeps INTEGER NOT NULL DEFAULT 4,
  transmission TEXT DEFAULT 'Automatic',
  condition TEXT DEFAULT 'Excellent',
  type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  country TEXT DEFAULT 'USA',
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  is_sold BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rv_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view listings" ON public.rv_listings FOR SELECT USING (true);

-- Create table for inquiries
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rv_id UUID REFERENCES public.rv_listings(id) ON DELETE SET NULL,
  rv_title TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Create table for financing applications
CREATE TABLE public.financing_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rv_id UUID REFERENCES public.rv_listings(id) ON DELETE SET NULL,
  rv_title TEXT,
  rv_price NUMERIC,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  down_payment NUMERIC DEFAULT 0,
  loan_term INTEGER DEFAULT 60,
  estimated_monthly NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit financing app" ON public.financing_applications FOR INSERT WITH CHECK (true);

-- Create storage bucket for RV images
INSERT INTO storage.buckets (id, name, public) VALUES ('rv-images', 'rv-images', true);
CREATE POLICY "Anyone can view rv images" ON storage.objects FOR SELECT USING (bucket_id = 'rv-images');
CREATE POLICY "Anyone can upload rv images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rv-images');
CREATE POLICY "Anyone can update rv images" ON storage.objects FOR UPDATE USING (bucket_id = 'rv-images');
CREATE POLICY "Anyone can delete rv images" ON storage.objects FOR DELETE USING (bucket_id = 'rv-images');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_rv_listings_updated_at
  BEFORE UPDATE ON public.rv_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
