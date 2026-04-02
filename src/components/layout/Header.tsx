import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "Financing", to: "/financing" },
  { label: "Trade In", to: "/trade-in" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function getWishlistCount(): number {
  try {
    return JSON.parse(localStorage.getItem("rv_favorites") || "[]").length;
  } catch {
    return 0;
  }
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [wishCount, setWishCount] = useState(getWishlistCount);

  useEffect(() => {
    const update = () => setWishCount(getWishlistCount());
    window.addEventListener("storage", update);
    window.addEventListener("wishlist-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("wishlist-updated", update);
    };
  }, []);

  // Re-check on route change
  useEffect(() => {
    setWishCount(getWishlistCount());
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/Rk7Hkg73/IMG-1811-removebg-preview.png"
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
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishCount > 9 ? "9+" : wishCount}
              </span>
            )}
          </Link>
          <Button asChild>
            <Link to="/financing">Apply for Financing</Link>
          </Button>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <Link to="/favorites" className="relative p-2 hover:bg-muted rounded-lg transition" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-muted-foreground" />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishCount > 9 ? "9+" : wishCount}
              </span>
            )}
          </Link>
          <button
            className="p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
          <Button className="w-full" asChild>
            <Link to="/financing" onClick={() => setMobileOpen(false)}>Apply for Financing</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
