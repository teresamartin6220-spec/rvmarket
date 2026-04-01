import { MessageSquare } from "lucide-react";
import { companyInfo } from "@/data/mockData";

export function SmsButton() {
  const smsLink = `sms:${companyInfo.textNumber.replace(/\D/g, '')}`;

  return (
    <a
      href={smsLink}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
      aria-label="Text us"
    >
      <MessageSquare className="h-7 w-7" />
    </a>
  );
}
