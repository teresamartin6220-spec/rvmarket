import { Link } from "react-router-dom";
import { Search, ArrowRight, Shield, Award, Globe, Truck, RefreshCw, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RVCard } from "@/components/rv/RVCard";
import { rvListings, companyInfo } from "@/data/mockData";
import heroImage from "@/assets/hero-rv.jpg";

const Index = () => {
  const featured = rvListings.slice(0, 4);

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
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-sm px-4 py-1.5 text-sm text-primary-foreground mb-4">
              <Award className="h-4 w-4" />
              <span>Trusted for Over {companyInfo.yearsInBusiness} Years</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary-foreground leading-tight">
              Find Your Perfect <br />
              <span className="text-secondary">Used RV</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Buy or trade in quality pre-owned motorhomes, travel trailers, and campers. Serving customers across the USA, Canada, UK & Australia.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" asChild>
                <Link to="/inventory">
                  <Search className="mr-2 h-4 w-4" /> Browse Inventory
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/trade-in">
                  <RefreshCw className="mr-2 h-4 w-4" /> Trade In Your RV
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
              { value: "10,000+", label: "RVs Sold" },
              { value: "25+", label: "Years Experience" },
              { value: "4", label: "Countries Served" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold font-heading text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground">Why Choose RV Market</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            With over {companyInfo.yearsInBusiness} years in the trade, we deliver trust, quality, and exceptional service worldwide.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Quality Guaranteed", desc: "Every RV undergoes rigorous inspection before listing" },
            { icon: Globe, title: "Global Reach", desc: "Serving USA, Canada, UK & Australia" },
            { icon: Truck, title: "Trade-In Program", desc: "Sell your used RV or trade it in for an upgrade" },
            { icon: Headphones, title: "24/7 Support", desc: "Our customer care team is always here to help" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-center shadow-card hover:shadow-card-hover transition-shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-muted/50">
        <div className="container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground">Featured RVs</h2>
              <p className="text-muted-foreground mt-1">Hand-picked quality listings</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/inventory">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((rv, i) => (
              <RVCard key={rv.id} rv={rv} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trade-In CTA */}
      <section className="bg-gradient-warm">
        <div className="container py-16 text-center">
          <RefreshCw className="h-10 w-10 text-accent-foreground mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-heading text-accent-foreground">Want to Sell or Trade In Your RV?</h2>
          <p className="text-accent-foreground/80 mt-2 max-w-md mx-auto">
            We buy used RVs and offer competitive trade-in values. Get a free valuation today.
          </p>
          <Button size="lg" variant="secondary" className="mt-6 bg-card text-foreground hover:bg-card/90" asChild>
            <Link to="/trade-in">Get Your Free Valuation</Link>
          </Button>
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
