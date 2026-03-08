import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DBListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  stock_number: string | null;
  vin: string | null;
  price: number;
  mileage: number;
  sleeps: number;
  transmission: string | null;
  condition: string | null;
  type: string;
  description: string | null;
  location: string | null;
  country: string | null;
  images: string[] | null;
  specs: any;
  features: any;
  is_sold: boolean | null;
  created_at?: string;
}

export function useListings() {
  const [listings, setListings] = useState<DBListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rv_listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  return { listings, loading, refetch: fetch };
}

export function useListingById(id: string | undefined) {
  const [listing, setListing] = useState<DBListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase
      .from("rv_listings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error) setListing(data);
        setLoading(false);
      });
  }, [id]);

  return { listing, loading };
}
