import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "Trade In", to: "/trade-in" },
  { label: "About Us", to: "/about" },
  { label: "Customer Care", to: "/customer-care" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-lg font-bold text-primary-foreground font-heading">R</span>
          </div>
          <span className="text-xl font-bold font-heading text-foreground">RV Market</span>
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
          <CurrencySelector />
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/portal"><Heart className="h-4 w-4 mr-1" /> My Portal</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth"><UserPlus className="h-4 w-4 mr-1" /> Join Today</Link>
              </Button>
            </>
          )}
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
          <div className="py-2">
            <CurrencySelector />
          </div>
          {user ? (
            <>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/portal" onClick={() => setMobileOpen(false)}>My Portal</Link>
              </Button>
              <Button className="w-full" variant="ghost" onClick={() => { signOut(); setMobileOpen(false); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>Join Today</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
