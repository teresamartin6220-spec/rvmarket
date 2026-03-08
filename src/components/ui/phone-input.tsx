import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+1", label: "US/CA", flag: "🇺🇸" },
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+33", label: "FR", flag: "🇫🇷" },
  { code: "+49", label: "DE", flag: "🇩🇪" },
  { code: "+34", label: "ES", flag: "🇪🇸" },
  { code: "+39", label: "IT", flag: "🇮🇹" },
  { code: "+81", label: "JP", flag: "🇯🇵" },
  { code: "+86", label: "CN", flag: "🇨🇳" },
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+52", label: "MX", flag: "🇲🇽" },
  { code: "+55", label: "BR", flag: "🇧🇷" },
  { code: "+971", label: "AE", flag: "🇦🇪" },
  { code: "+966", label: "SA", flag: "🇸🇦" },
  { code: "+27", label: "ZA", flag: "🇿🇦" },
  { code: "+82", label: "KR", flag: "🇰🇷" },
  { code: "+65", label: "SG", flag: "🇸🇬" },
  { code: "+64", label: "NZ", flag: "🇳🇿" },
];

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  required?: boolean;
  className?: string;
}

export function PhoneInput({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  required,
  className,
}: PhoneInputProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-[110px] shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.flag} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="Phone number"
        required={required}
        className="flex-1"
      />
    </div>
  );
}
