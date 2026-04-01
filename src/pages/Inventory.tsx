import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RVCard } from "@/components/rv/RVCard";
import { RV_TYPES } from "@/data/mockData";
import { useListings } from "@/hooks/useListings";

type SortKey = "price-asc" | "price-desc" | "newest" | "mileage";

const Inventory = () => {
  const { listings, loading } = useListings();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("price-asc");

  const filtered = useMemo(() => {
    let list = [...listings];

    if (typeFilter !== "All") list = list.filter((rv) => rv.type === typeFilter);
    if (maxPrice) list = list.filter((rv) => rv.price <= Number(maxPrice));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((rv) =>
        (rv.stock_number || "").toLowerCase().includes(q) ||
        rv.brand.toLowerCase().includes(q) ||
        rv.type.toLowerCase().includes(q) ||
        rv.title.toLowerCase().includes(q) ||
        String(rv.mileage).includes(q)
      );
    }

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => b.year - a.year); break;
      case "mileage": list.sort((a, b) => a.mileage - b.mileage); break;
    }

    return list;
  }, [listings, typeFilter, maxPrice, searchQuery, sort]);

  const clearFilters = () => {
    setTypeFilter("All");
    setMaxPrice("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      <div className="container py-10">
        <h1 className="text-3xl font-bold font-heading text-foreground">RV Inventory</h1>
        <p className="text-muted-foreground mt-1">Browse {listings.length} quality pre-owned RVs</p>
      </div>

      <div className="container pb-8">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by stock #, brand, type, or mileage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters - horizontal push down */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> {filtersOpen ? "Hide Filters" : "Filters"}
            </Button>
            <div className="flex-1" />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="mileage">Mileage</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filtered.length} results</span>
          </div>

          {filtersOpen && (
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>RV Type / Category</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {RV_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Max Price (USD)</Label>
                  <Input type="number" placeholder="e.g. 50000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="mt-1.5" />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" /> Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No RVs match your filters.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
};

export default Inventory;
