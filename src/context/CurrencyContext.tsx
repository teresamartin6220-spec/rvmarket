import { createContext, useContext, useState, ReactNode } from "react";

export type CurrencyCode = "USD" | "GBP" | "AUD" | "CAD";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // relative to USD
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "US Dollar", rate: 1 },
  { code: "GBP", symbol: "£", label: "British Pound", rate: 0.79 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", rate: 1.53 },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", rate: 1.36 },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyCode: (code: CurrencyCode) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>("USD");
  const currency = CURRENCIES.find((c) => c.code === code)!;

  const convert = (usdAmount: number) => Math.round(usdAmount * currency.rate);
  const format = (usdAmount: number) => `${currency.symbol}${convert(usdAmount).toLocaleString()}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode: setCode, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
