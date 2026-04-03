import { motion } from "framer-motion";
import { DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { maskPhoneInput } from "@/lib/phoneFormat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Financing = () => {
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
        rv_title: "General Financing Inquiry",
      });
      if (error) throw error;

      await supabase.functions.invoke("notify-email", {
        body: { type: "financing", data: { rv_title: "General Financing Inquiry", ...form } },
      });

      toast.success("Financing application submitted! We'll contact you shortly.");
      setForm({ name: "", email: "", phone: "", downPayment: "", loanTerm: "60" });
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="relative">
        <img src="https://i.ibb.co/QvTJN2bz/IMG-1312.jpg" alt="" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">Apply for Financing</h1>
            <p className="text-white/80 mt-2 max-w-xl">
              Get pre-approved for competitive rates and flexible terms on your dream RV.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        <section className="rounded-xl bg-muted/50 p-8">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-6">Why Finance With Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Competitive interest rates",
              "Flexible terms from 36 to 72 months",
              "Quick pre-approval process",
              "No hidden fees",
              "Expert guidance throughout",
              "Available for all credit types",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-foreground text-center mb-2">Get Pre-Approved</h2>
          <p className="text-muted-foreground text-center mb-8">Fill out the form below and our team will get back to you.</p>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: maskPhoneInput(e.target.value) })}
                  placeholder="(xxx) xxx-xxxx"
                />
              </div>
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
        </section>
      </div>
    </motion.div>
  );
};

export default Financing;
