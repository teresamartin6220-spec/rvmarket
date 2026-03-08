import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { companyInfo } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactFormProps {
  rvTitle: string;
  rvId?: string;
}

export function ContactForm({ rvTitle, rvId }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: `I'm interested in the ${rvTitle}. Please send me more information.` });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("inquiries").insert({
        rv_id: rvId || null,
        rv_title: rvTitle,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message || null,
      });
      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke("notify-email", {
        body: { type: "inquiry", data: { rv_title: rvTitle, ...form } },
      });

      toast.success("Inquiry sent! We'll contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error("Failed to send inquiry. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Contact About This RV</h3>
        <p className="text-sm text-muted-foreground mt-1">{companyInfo.name}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
          <Phone className="h-4 w-4 text-primary" /> {companyInfo.phone}
        </a>
        <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
          <Mail className="h-4 w-4 text-primary" /> Email
        </a>
        <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
          <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <Label>Message</Label>
          <Textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Sending..." : "Send Inquiry"}
        </Button>
      </form>
    </div>
  );
}
