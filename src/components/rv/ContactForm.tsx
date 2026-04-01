import { useState } from "react";
import { MessageSquare, Mail } from "lucide-react";
import { companyInfo } from "@/data/mockData";

interface ContactFormProps {
  rvTitle: string;
  rvId?: string;
  stockNumber?: string | null;
}

export function ContactForm({ rvTitle, rvId, stockNumber }: ContactFormProps) {
  const contactLabel = `${rvTitle}${stockNumber ? ` (Stock #${stockNumber})` : ""}`;

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Contact About This RV</h3>
        <p className="text-sm text-muted-foreground mt-1">{companyInfo.name}</p>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`sms:${companyInfo.textNumber.replace(/\D/g, '')}?body=${encodeURIComponent(`Hi, I'm interested in the ${contactLabel}`)}`}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
        >
          <MessageSquare className="h-5 w-5 text-primary" /> Text Us
        </a>
        <a
          href={`mailto:${companyInfo.email}?subject=${encodeURIComponent(`RV Inquiry - ${contactLabel}`)}`}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
        >
          <Mail className="h-5 w-5 text-primary" /> Email Us
        </a>
      </div>
    </div>
  );
}
