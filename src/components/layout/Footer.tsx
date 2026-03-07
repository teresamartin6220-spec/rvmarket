import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
                <span className="text-lg font-bold font-heading">R</span>
              </div>
              <span className="text-xl font-bold font-heading">RV Market</span>
            </div>
            <p className="text-sm opacity-70">
              Your trusted marketplace for quality pre-owned RVs across the United States.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition">Home</Link></li>
              <li><Link to="/inventory" className="hover:opacity-100 transition">Inventory</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Denver, CO</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> (800) 555-0123</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@rvmarket.com</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /> Mon-Sat 9AM-6PM</li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0" /> Text: (800) 555-0124</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {["TikTok", "WhatsApp", "Facebook", "Instagram", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold hover:bg-primary/40 transition"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
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
