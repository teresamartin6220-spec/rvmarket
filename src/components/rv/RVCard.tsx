import { Link } from "react-router-dom";
import { MapPin, Users, Gauge, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { RV } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

interface RVCardProps {
  rv: RV;
  index?: number;
}

function useFavorites() {
  const getFavs = (): string[] => {
    try { return JSON.parse(localStorage.getItem("rv_favorites") || "[]"); } catch { return []; }
  };
  const [favs, setFavs] = useState(getFavs);

  const toggle = (id: string) => {
    const updated = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    localStorage.setItem("rv_favorites", JSON.stringify(updated));
    setFavs(updated);
  };

  return { favs, toggle };
}

export function RVCard({ rv, index = 0 }: RVCardProps) {
  const { format } = useCurrency();
  const { favs, toggle } = useFavorites();
  const isFav = favs.includes(rv.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group overflow-hidden rounded-lg border bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={rv.images[0]}
          alt={rv.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground line-clamp-1">
            {rv.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggle(rv.id); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
          <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            {rv.year}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">{rv.brand}</p>
          <h3 className="font-heading font-semibold text-foreground line-clamp-1">{rv.title}</h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{rv.location}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Sleeps {rv.sleeps}</span>
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{rv.mileage.toLocaleString()} mi</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xl font-bold font-heading text-primary">
            {format(rv.price)}
          </span>
          <Button size="sm" asChild>
            <Link to={`/rv/${rv.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
