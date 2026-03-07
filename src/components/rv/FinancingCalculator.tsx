import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancingCalculatorProps {
  price: number;
}

const LOAN_TERMS = [36, 48, 60, 72];
const INTEREST_RATE = 3.7;

export function FinancingCalculator({ price }: FinancingCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.1));
  const [loanTerm, setLoanTerm] = useState(60);

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
                  <Input value={`$${price.toLocaleString()}`} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Down Payment</Label>
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
                  ${monthlyPayment.toFixed(0)}<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </div>

              <Button className="w-full" size="lg">
                Continue Financing Application
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
