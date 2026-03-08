import { Link } from "react-router-dom";
import { MapPin, Users, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import type { RV } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

interface RVCardProps {
  rv: RV;
  index?: number;
}

export function RVCard({ rv, index = 0 }: RVCardProps) {
  const { format } = useCurrency();

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
        <div className="absolute top-3 right-3">
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
