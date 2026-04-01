import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "Financing", to: "/financing" },
  { label: "Trade In", to: "/trade-in" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/6RXZhh90/IMG-1299.png"
            alt="RV Market"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/favorites" className="relative p-2 hover:bg-muted rounded-lg transition" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Button asChild>
            <Link to="/financing">Apply for Financing</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-card p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 py-2">
            <Link to="/favorites" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-foreground">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
          </div>
          <Button className="w-full" asChild>
            <Link to="/financing" onClick={() => setMobileOpen(false)}>Apply for Financing</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
