import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useListings } from "@/hooks/useListings";
import { companyInfo } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function getFavs(): string[] {
  try { return JSON.parse(localStorage.getItem("rv_favorites") || "[]"); } catch { return []; }
}

const Favorites = () => {
  const { listings } = useListings();
  const [favIds, setFavIds] = useState<string[]>(getFavs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const favListings = useMemo(() => listings.filter((rv) => favIds.includes(rv.id)), [listings, favIds]);

  const removeFav = (id: string) => {
    const updated = favIds.filter((f) => f !== id);
    localStorage.setItem("rv_favorites", JSON.stringify(updated));
    setFavIds(updated);
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.size === 0) { toast.error("Please select at least one RV"); return; }
    setLoading(true);
    try {
      const selectedRVs = favListings.filter((rv) => selectedIds.has(rv.id));
      const rvNames = selectedRVs.map((rv) => `${rv.title} (Stock #${rv.stock_number || "N/A"})`).join(", ");
      
      const { error } = await supabase.from("inquiries").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: `Interested in: ${rvNames}. ${form.message}`,
        rv_title: rvNames,
      });
      if (error) throw error;

      await supabase.functions.invoke("notify-email", {
        body: { type: "inquiry", data: { rv_title: rvNames, ...form } },
      });

      toast.success("Inquiry sent! We'll contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="bg-gradient-hero">
        <div className="container py-10">
          <h1 className="text-3xl font-bold font-heading text-primary-foreground flex items-center gap-3">
            <Heart className="h-8 w-8" /> My Wishlist
          </h1>
          <p className="text-primary-foreground/70 mt-1">{favListings.length} saved RV{favListings.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container py-8">
        {favListings.length === 0 ? (
          <div className="py-20 text-center">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-foreground">Your wishlist is empty</h2>
            <p className="text-muted-foreground mt-2">Browse our inventory and tap the heart icon to save RVs you love.</p>
            <Button className="mt-6" asChild><Link to="/inventory">Browse Inventory <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {favListings.map((rv) => (
                <div key={rv.id} className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-card">
                  <Checkbox
                    checked={selectedIds.has(rv.id)}
                    onCheckedChange={() => toggleSelect(rv.id)}
                  />
                  <Link to={`/rv/${rv.id}`} className="shrink-0">
                    <img src={(rv.images || [])[0]} alt={rv.title} className="h-20 w-28 rounded-md object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/rv/${rv.id}`} className="font-heading font-semibold text-foreground hover:text-primary transition line-clamp-1">{rv.title}</Link>
                    <p className="text-sm text-muted-foreground">{rv.year} · {rv.location || "N/A"} · Stock #{rv.stock_number || "N/A"}</p>
                    <p className="text-lg font-bold font-heading text-primary">${rv.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFav(rv.id)} className="p-2 text-muted-foreground hover:text-destructive transition" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-20 self-start">
              <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-4 shadow-card">
                <h3 className="font-heading font-semibold text-foreground text-lg">Inquire About Selected RVs</h3>
                <p className="text-sm text-muted-foreground">Select the RVs you're interested in and send us an inquiry.</p>
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="Any specific questions?" /></div>
                <Button type="submit" className="w-full" disabled={loading || selectedIds.size === 0}>
                  {loading ? "Sending..." : `Send Inquiry (${selectedIds.size} selected)`}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
