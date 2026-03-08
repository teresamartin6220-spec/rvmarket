
-- Allow insert/update/delete on rv_listings (admin managed via client-side auth for now)
CREATE POLICY "Allow insert on rv_listings" ON public.rv_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on rv_listings" ON public.rv_listings FOR UPDATE USING (true);
CREATE POLICY "Allow delete on rv_listings" ON public.rv_listings FOR DELETE USING (true);
