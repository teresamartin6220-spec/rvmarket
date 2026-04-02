import { motion } from "framer-motion";
import { Mail, MessageSquare, Clock, MapPin, HelpCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { companyInfo } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { formatPhone, maskPhoneInput } from "@/lib/phoneFormat";

const faqs = [
  { q: "How do I schedule a viewing?", a: "Contact us via text or email to schedule a viewing at a time that suits you. We're available Mon-Sat 8AM-6PM." },
  { q: "Do you offer financing?", a: "Yes! We offer competitive financing options with flexible loan terms. Use our financing calculator on any listing page." },
  { q: "Can I trade in my current RV?", a: "Absolutely. We accept trade-ins and offer competitive valuations. Visit our Trade-In page to get a free estimate." },
  { q: "Do you ship nationwide?", a: "Yes, we serve customers across the entire United States. Contact us for shipping details and quotes." },
  { q: "What warranty do you offer?", a: "All our RVs come with a comprehensive inspection report. Extended warranty options are available at the time of purchase." },
  { q: "How do I return or exchange an RV?", a: "We offer a satisfaction guarantee. Contact our team within 7 days of purchase to discuss returns or exchanges." },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero with background image */}
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1400" alt="" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">Contact</h1>
            <p className="text-white/80 mt-2 max-w-xl">
              We're here to help. Reach out anytime — our team is dedicated to your satisfaction.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: MessageSquare, title: "Text Us", value: formatPhone(companyInfo.textNumber), href: `sms:${companyInfo.textNumber.replace(/\D/g, '')}` },
            { icon: Mail, title: "Email Us", value: companyInfo.email, href: `mailto:${companyInfo.email}` },
            { icon: Clock, title: "Business Hours", value: companyInfo.hours, href: undefined },
          ].map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-center shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{title}</h3>
              {href ? (
                <a href={href} className="text-sm text-primary hover:underline mt-1 block">{value}</a>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{value}</p>
              )}
            </div>
          ))}
        </section>

        <section>
          <div className="text-center mb-8">
            <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold font-heading text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-medium text-foreground">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold font-heading text-foreground">Send Us a Message</h2>
            <p className="text-muted-foreground mt-1">We typically respond within 24 hours</p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-4 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
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
              <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
            </div>
            <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required /></div>
            <Button type="submit" className="w-full" size="lg">Send Message</Button>
          </form>
        </section>
      </div>
    </motion.div>
  );
};

export default Contact;
