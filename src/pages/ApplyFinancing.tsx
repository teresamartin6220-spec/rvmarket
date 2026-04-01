import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useListingById } from "@/hooks/useListings";

const ApplyFinancing = () => {
  const [searchParams] = useSearchParams();
  const rvId = searchParams.get("rv");
  const { listing: rv } = useListingById(rvId);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", downPayment: "", loanTerm: "60",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("financing_applications").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        down_payment: form.downPayment ? Number(form.downPayment.replace(/,/g, '')) : null,
        loan_term: Number(form.loanTerm),
        rv_id: rvId || null,
        rv_title: rv?.title || "N/A",
        rv_price: rv?.price || null,
      });
      if (error) throw error;

      await supabase.functions.invoke("notify-email", {
        body: { type: "financing", data: { rv_title: rv?.title || "N/A", ...form } },
      });

      toast.success("Application submitted! We'll contact you shortly.");
      setForm({ name: "", email: "", phone: "", downPayment: "", loanTerm: "60" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="border-b bg-card">
        <div className="container py-3">
          <Link to={rvId ? `/rv/${rvId}` : "/inventory"} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {rv && (
          <div className="rounded-lg border bg-card p-4 flex gap-4 items-center mb-8">
            <img src={(rv.images || [])[0]} alt={rv.title} className="h-20 w-28 rounded-md object-cover shrink-0" />
            <div>
              <h2 className="font-heading font-semibold text-foreground">{rv.title}</h2>
              <p className="text-sm text-muted-foreground">Stock #{rv.stock_number || "N/A"} · {rv.year}</p>
              <p className="text-lg font-bold font-heading text-primary">${rv.price.toLocaleString()}</p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Apply for Financing</h1>
        <p className="text-muted-foreground mb-8">Fill out the form below and our financing team will get back to you.</p>

        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div>
              <Label>Down Payment ($)</Label>
              <Input
                value={form.downPayment}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setForm({ ...form, downPayment: raw ? Number(raw).toLocaleString() : '' });
                }}
                placeholder="e.g. 5,000"
              />
            </div>
          </div>
          <div>
            <Label>Preferred Loan Term</Label>
            <select
              value={form.loanTerm}
              onChange={(e) => setForm({ ...form, loanTerm: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
              <option value="72">72 months</option>
            </select>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ApplyFinancing;
