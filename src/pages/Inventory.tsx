import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RVCard } from "@/components/rv/RVCard";
import { RV_TYPES } from "@/data/mockData";
import { useListings } from "@/hooks/useListings";

type SortKey = "price-asc" | "price-desc" | "newest" ;

const Inventory = () => {
  const { listings, loading } = useListings();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("price-asc");

  const filtered = useMemo(() => {
    let list = [...listings];

    if (typeFilter !== "All") list = list.filter((rv) => rv.type === typeFilter);
    if (maxPrice) list = list.filter((rv) => rv.price <= Number(maxPrice));
    if (locationFilter) list = list.filter((rv) =>
      (rv.location || "").toLowerCase().includes(locationFilter.toLowerCase()) ||
      (rv.country || "").toLowerCase().includes(locationFilter.toLowerCase())
    );

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => b.year - a.year); break;
    }

    return list;
  }, [listings, typeFilter, maxPrice, locationFilter, sort]);

  const clearFilters = () => {
    setTypeFilter("All");
    setMaxPrice("");
    setLocationFilter("");
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-hero">
        <div className="container py-10">
          <h1 className="text-3xl font-bold font-heading text-primary-foreground">RV Inventory</h1>
          <p className="text-primary-foreground/70 mt-1">Browse {listings.length} quality pre-owned RVs</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="flex-1" />
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} results</span>
        </div>

        <div className="flex gap-8">
          <aside className={`shrink-0 w-64 space-y-6 ${filtersOpen ? "block" : "hidden md:block"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="City, state, or country..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>RV Type / Category</Label>
              <div className="mt-1.5 space-y-1 max-h-64 overflow-y-auto">
                <button onClick={() => setTypeFilter("All")} className={`block w-full rounded-md px-3 py-2 text-sm text-left transition ${typeFilter === "All" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>All Types</button>
                {RV_TYPES.map((type) => (
                  <button key={type} onClick={() => setTypeFilter(type)} className={`block w-full rounded-md px-3 py-2 text-xs text-left transition ${typeFilter === type ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>{type}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Max Price (USD)</Label>
              <Input type="number" placeholder="e.g. 50000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="mt-1.5" />
            </div>
            <Button variant="outline" className="w-full md:hidden" onClick={() => setFiltersOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Close Filters
            </Button>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground">Loading inventory...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No RVs match your filters.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((rv, i) => (
                  <RVCard key={rv.id} rv={{
                    id: rv.id,
                    title: rv.title,
                    brand: rv.brand,
                    model: rv.model,
                    year: rv.year,
                    stockNumber: rv.stock_number || "",
                    vin: rv.vin || "",
                    price: rv.price,
                    mileage: rv.mileage,
                    sleeps: rv.sleeps,
                    transmission: rv.transmission || "Automatic",
                    condition: rv.condition || "Excellent",
                    type: rv.type as any,
                    description: rv.description || "",
                    location: rv.location || "",
                    country: rv.country || "USA",
                    images: rv.images || [],
                    specs: rv.specs,
                    features: rv.features,
                    isSuperSpecial: rv.is_super_special || false,
                  }} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
