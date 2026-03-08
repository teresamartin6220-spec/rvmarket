import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useCurrency } from "@/context/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FinancingCalculatorProps {
  price: number;
  rvTitle?: string;
  rvId?: string;
}

const LOAN_TERMS = [36, 48, 60, 72];
const INTEREST_RATE = 3.7;

export function FinancingCalculator({ price, rvTitle, rvId }: FinancingCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.1));
  const [loanTerm, setLoanTerm] = useState(60);
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", countryCode: "+1", phone: "" });
  const [loading, setLoading] = useState(false);
  const { format, currency } = useCurrency();

  const monthlyPayment = useMemo(() => {
    const principal = price - downPayment;
    if (principal <= 0) return 0;
    const monthlyRate = INTEREST_RATE / 100 / 12;
    if (monthlyRate === 0) return principal / loanTerm;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1)
    );
  }, [price, downPayment, loanTerm]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        rv_id: rvId || null,
        rv_title: rvTitle || null,
        rv_price: price,
        name: form.name,
        email: form.email,
        phone: `${form.countryCode} ${form.phone}`,
        down_payment: downPayment,
        loan_term: loanTerm,
        estimated_monthly: Math.round(monthlyPayment),
      };
      const { error } = await supabase.from("financing_applications").insert(payload);
      if (error) throw error;

      await supabase.functions.invoke("notify-email", {
        body: { type: "financing", data: payload },
      });

      toast.success("Financing application submitted! We'll be in touch.");
      setApplyOpen(false);
      setForm({ name: "", email: "", phone: "" });
    } catch (err: any) {
      toast.error("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="financing" className="rounded-lg border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-muted/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Apply for Financing</h3>
            <p className="text-sm text-muted-foreground">Fixed rate at {INTEREST_RATE}% APR</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 space-y-5 border-t">
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div>
                  <Label>RV Price</Label>
                  <Input value={format(price)} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Down Payment (USD)</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min={0}
                    max={price}
                  />
                </div>
                <div>
                  <Label>Interest Rate</Label>
                  <Input value={`${INTEREST_RATE}%`} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Loan Term</Label>
                  <div className="flex gap-2 mt-1.5">
                    {LOAN_TERMS.map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`flex-1 rounded-md border px-2 py-2 text-sm font-medium transition ${
                          loanTerm === term
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {term}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                <p className="text-3xl font-bold font-heading text-primary mt-1">
                  {currency.symbol}{Math.round(monthlyPayment * currency.rate).toLocaleString()}<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </div>

              {!applyOpen ? (
                <Button className="w-full" size="lg" onClick={() => setApplyOpen(true)}>
                  Continue Financing Application
                </Button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-heading font-semibold text-foreground">Your Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Financing Application"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
