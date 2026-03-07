import { Link } from "react-router-dom";
import { Search, MapPin, Truck, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RVCard } from "@/components/rv/RVCard";
import { rvListings } from "@/data/mockData";
import heroImage from "@/assets/hero-rv.jpg";

const Index = () => {
  const featured = rvListings.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="RV Adventure" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary-foreground leading-tight">
              Find Your Perfect <br />
              <span className="text-secondary">Used RV</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Browse quality pre-owned motorhomes, travel trailers, and campers from trusted dealers across the United States.
            </p>

            {/* Search Bar */}
            <div className="mt-8 rounded-xl bg-card/95 backdrop-blur-md p-4 shadow-elevated">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Location" className="pl-9" />
                </div>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="RV Type" className="pl-9" />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Max Price" className="pl-9" />
                </div>
              </div>
              <Button className="w-full mt-3" size="lg" asChild>
                <Link to="/inventory">
                  <Search className="mr-2 h-4 w-4" /> Search Inventory
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "RVs Available" },
              { value: "50+", label: "Dealers" },
              { value: "48", label: "States Covered" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold font-heading text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-heading text-foreground">Featured RVs</h2>
            <p className="text-muted-foreground mt-1">Hand-picked quality listings</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/inventory">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((rv, i) => (
            <RVCard key={rv.id} rv={rv} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero">
        <div className="container py-16 text-center">
          <h2 className="text-3xl font-bold font-heading text-primary-foreground">Ready to Hit the Road?</h2>
          <p className="text-primary-foreground/80 mt-2 max-w-md mx-auto">
            Browse our full inventory and find the RV that fits your lifestyle and budget.
          </p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link to="/inventory">Browse All Inventory</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
