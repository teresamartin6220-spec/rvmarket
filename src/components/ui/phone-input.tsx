import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { value: "US", code: "+1", flag: "🇺🇸" },
  { value: "CA", code: "+1", flag: "🇨🇦" },
  { value: "GB", code: "+44", flag: "🇬🇧" },
  { value: "AU", code: "+61", flag: "🇦🇺" },
  { value: "FR", code: "+33", flag: "🇫🇷" },
  { value: "DE", code: "+49", flag: "🇩🇪" },
  { value: "ES", code: "+34", flag: "🇪🇸" },
  { value: "IT", code: "+39", flag: "🇮🇹" },
  { value: "JP", code: "+81", flag: "🇯🇵" },
  { value: "CN", code: "+86", flag: "🇨🇳" },
  { value: "IN", code: "+91", flag: "🇮🇳" },
  { value: "MX", code: "+52", flag: "🇲🇽" },
  { value: "BR", code: "+55", flag: "🇧🇷" },
  { value: "AE", code: "+971", flag: "🇦🇪" },
  { value: "SA", code: "+966", flag: "🇸🇦" },
  { value: "ZA", code: "+27", flag: "🇿🇦" },
  { value: "KR", code: "+82", flag: "🇰🇷" },
  { value: "SG", code: "+65", flag: "🇸🇬" },
  { value: "NZ", code: "+64", flag: "🇳🇿" },
];

export function getDialCode(value: string) {
  return COUNTRY_CODES.find((c) => c.value === value)?.code ?? "+1";
}

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (value: string) => void;
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
        <SelectTrigger className="w-[120px] shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
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
