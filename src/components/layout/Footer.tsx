import { Link } from "react-router-dom";
import { MapPin, Mail, Clock, MessageSquare } from "lucide-react";
import { companyInfo } from "@/data/mockData";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.18 8.18 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="https://i.ibb.co/6RXZhh90/IMG-1299.png" alt="RV Market" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm opacity-70">
              Your trusted marketplace for quality pre-owned RVs. Over {companyInfo.yearsInBusiness} years of experience serving customers nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition">Home</Link></li>
              <li><Link to="/inventory" className="hover:opacity-100 transition">Inventory</Link></li>
              <li><Link to="/financing" className="hover:opacity-100 transition">Financing</Link></li>
              <li><Link to="/trade-in" className="hover:opacity-100 transition">Trade In Your RV</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> {companyInfo.address}, {companyInfo.city}, {companyInfo.state}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> {companyInfo.email}</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /> {companyInfo.hours}</li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <a href={`sms:${companyInfo.textNumber.replace(/\D/g, '')}`} className="hover:opacity-100 transition">
                  Text: {companyInfo.textNumber}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href={companyInfo.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs opacity-50">
          © {new Date().getFullYear()} RV Market. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
