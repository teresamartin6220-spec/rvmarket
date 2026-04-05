import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companyInfo } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { maskPhoneInput } from "@/lib/phoneFormat";
import { supabase } from "@/integrations/supabase/client";

const TradeIn = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    rvYear: "", rvMake: "", rvModel: "", rvType: "",
    mileage: "", condition: "", description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tradeDetails = `Trade-In: ${form.rvYear} ${form.rvMake} ${form.rvModel} (${form.rvType || "N/A"}) - Mileage: ${form.mileage || "N/A"}, Condition: ${form.condition || "N/A"}. ${form.description}`;

      await supabase.from("inquiries").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: tradeDetails,
        rv_title: "Trade-In Request",
      });

      await supabase.functions.invoke("notify-email", {
        body: {
          type: "trade-in",
          data: { name: form.name, email: form.email, phone: form.phone, ...form },
        },
      });

      toast.success("Trade-in request submitted! We'll contact you with a valuation within 48 hours.");
      setForm({ name: "", email: "", phone: "", rvYear: "", rvMake: "", rvModel: "", rvType: "", mileage: "", condition: "", description: "" });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero with background image */}
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="h-8 w-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">Trade In Your RV</h1>
            </div>
            <p className="text-white/80 mt-2 max-w-xl">
              Ready to upgrade? We buy used RVs and offer competitive trade-in values. Get a free, no-obligation valuation today.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        <section>
          <h2 className="text-2xl font-bold font-heading text-foreground text-center mb-8">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Submit Your RV Details", desc: "Fill out the form below with your RV's information and condition." },
              { step: "2", title: "Get Your Valuation", desc: "Our team will review and provide a competitive trade-in offer within 48 hours." },
              { step: "3", title: "Complete the Trade", desc: "Accept the offer and apply it towards your next RV purchase — or receive cash." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="rounded-xl border bg-card p-6 text-center shadow-card relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold font-heading text-xl mb-4">
                  {step}
                </div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-muted/50 p-8">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-6">Why Trade With Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Competitive market-value offers",
              "Free, no-obligation valuations",
              "Over 40 years of trade experience",
              "Apply trade value to any listing",
              "Quick and hassle-free process",
              "We handle all the paperwork",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-heading text-foreground text-center mb-2">Get Your Free Valuation</h2>
          <p className="text-muted-foreground text-center mb-8">Tell us about your RV and we'll get back to you with an offer.</p>

          <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-6 shadow-card">
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-4">Your Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div className="sm:col-span-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: maskPhoneInput(e.target.value) })}
                    placeholder="(xxx) xxx-xxxx"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-foreground mb-4">RV Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Year</Label><Input type="number" value={form.rvYear} onChange={(e) => setForm({ ...form, rvYear: e.target.value })} required placeholder="e.g. 2019" /></div>
                <div><Label>Make</Label><Input value={form.rvMake} onChange={(e) => setForm({ ...form, rvMake: e.target.value })} required placeholder="e.g. Winnebago" /></div>
                <div><Label>Model</Label><Input value={form.rvModel} onChange={(e) => setForm({ ...form, rvModel: e.target.value })} required placeholder="e.g. Travato 59KL" /></div>
                <div>
                  <Label>RV Type</Label>
                  <Select value={form.rvType} onValueChange={(v) => setForm({ ...form, rvType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-a">Class A</SelectItem>
                      <SelectItem value="class-c">Class C</SelectItem>
                      <SelectItem value="travel-trailer">Travel Trailer</SelectItem>
                      <SelectItem value="camper">Camper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Mileage</Label><Input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} placeholder="e.g. 25000" /></div>
                <div>
                  <Label>Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs-work">Needs Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label>Additional Details</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe any upgrades, damage, or additional info..." />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : <>Submit Trade-In Request <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </section>
      </div>
    </motion.div>
  );
};

export default TradeIn;
