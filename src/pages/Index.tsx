import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Shield, Award, Headphones, Truck, RefreshCw, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RVCard } from "@/components/rv/RVCard";
import { companyInfo } from "@/data/mockData";
import { useListings } from "@/hooks/useListings";
import heroImage from "@/assets/hero-rv.jpg";

const promiseItems = [
  { icon: Shield, title: "Quality Guaranteed", desc: "Every RV undergoes rigorous inspection before listing", image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600" },
  { icon: Award, title: "Nationwide Reach", desc: "Serving customers across the entire United States", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600" },
  { icon: Truck, title: "Trade-In Program", desc: "Sell your used RV or trade it in for an upgrade", image: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=600" },
  { icon: Headphones, title: "24/7 Support", desc: "Our customer care team is always here to help", image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=600" },
];

const trustedImages = [
  "https://i.ibb.co/rRfRzJ6k/IMG-1311.jpg",
  "https://i.ibb.co/QFmgsf8M/IMG-1310.webp",
  "https://i.ibb.co/dsY2kzz2/IMG-1309.webp",
];

const Index = () => {
  const { listings, loading } = useListings();
  const [slideIndex, setSlideIndex] = useState(0);
  const [trustedSlide, setTrustedSlide] = useState(0);
  const touchStartX = useRef(0);

  const featured = useMemo(() => {
    const featuredListings = listings.filter((rv) => rv.is_featured);
    const source = featuredListings.length > 0
      ? featuredListings.sort((a, b) => a.price - b.price)
      : [...listings].sort((a, b) => a.price - b.price);
    return source.slice(0, 8).map((rv) => ({
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
    }));
  }, [listings]);

  // Manual slide — no auto-slide for featured
  const maxSlideIndex = Math.max(0, featured.length - 4);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setSlideIndex((p) => Math.min(p + 1, maxSlideIndex));
      else setSlideIndex((p) => Math.max(p - 1, 0));
    }
  }, [maxSlideIndex]);

  // Auto-slide for trusted images
  useEffect(() => {
    const timer = setInterval(() => {
      setTrustedSlide((prev) => (prev + 1) % trustedImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="RV Adventure" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="container relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-sm px-4 py-1.5 text-sm text-primary-foreground mb-4">
              <Award className="h-4 w-4" />
              <span>Trusted for Over {companyInfo.yearsInBusiness} Years</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary-foreground leading-tight">
              Find Your Perfect <br /><span className="text-secondary">Used RV</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Buy or trade in quality pre-owned motorhomes, travel trailers, and campers. Serving customers nationwide.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" asChild><Link to="/inventory"><Search className="mr-2 h-4 w-4" /> Browse Inventory</Link></Button>
              <Button size="lg" variant="secondary" asChild><Link to="/trade-in"><RefreshCw className="mr-2 h-4 w-4" /> Trade In Your RV</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🔥 Special RV Deals - Auto Slideshow */}
      <section className="bg-muted/50">
        <div className="container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground">🔥 Special RV Deals</h2>
              <p className="text-muted-foreground mt-1">Hand-picked quality listings at the best prices</p>
            </div>
            <Button variant="outline" asChild><Link to="/inventory">View All <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading deals...</div>
          ) : (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${slideIndex * 25}%)` }}
              >
                {featured.map((rv, i) => (
                  <div key={rv.id} className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3">
                    <RVCard rv={rv} index={i} />
                  </div>
                ))}
              </div>
              {/* Slide indicators */}
              {featured.length > 4 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: Math.max(1, featured.length - 3) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`h-2 rounded-full transition-all ${slideIndex === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Our Promise */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground">Our Promise</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">With over {companyInfo.yearsInBusiness} years in the trade, we deliver trust, quality, and exceptional service nationwide.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {promiseItems.map(({ icon: Icon, title, desc, image }) => (
            <div key={title} className="rounded-xl border bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/about/our-promise">Learn More About Our Promise <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Trusted Nationwide */}
      <section className="bg-card border-y">
        <div className="container py-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground">Trusted Nationwide for Quality Pre-Owned RVs</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                RV Market Used RV connects buyers across the United States with reliable, budget-friendly pre-owned RVs. Every motorhome, travel trailer, and camper van is carefully inspected to meet high standards for safety, performance, and durability.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Whether you're buying your first RV, upgrading, or downsizing, we make the process simple with flexible financing, trade-in options, transparent pricing, and nationwide delivery. Our experienced team provides straightforward guidance to help you find the right RV and start your next adventure with confidence.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-video">
              {trustedImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`RV lifestyle ${i + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${trustedSlide === i ? "opacity-100" : "opacity-0"}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trade-In CTA */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=1400" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative py-16 text-center">
          <RefreshCw className="h-10 w-10 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-heading text-white">Want to Sell or Trade In Your RV?</h2>
          <p className="text-white/80 mt-2 max-w-md mx-auto">We buy used RVs and offer competitive trade-in values. Get a free valuation today.</p>
          <Button size="lg" variant="secondary" className="mt-6" asChild><Link to="/trade-in">Get Your Free Valuation</Link></Button>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="bg-muted/50">
        <div className="container py-16 text-center">
          <img src="https://i.ibb.co/QvTJN2bz/IMG-1312.jpg" alt="Financing" className="mx-auto h-32 w-auto object-contain rounded-lg mb-6" />
          <h2 className="text-3xl font-bold font-heading text-foreground">Flexible Financing Options</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Get pre-approved and drive away in your dream RV. Competitive rates and flexible terms.</p>
          <Button size="lg" className="mt-6" asChild><Link to="/financing"><DollarSign className="mr-2 h-4 w-4" /> Apply for Financing</Link></Button>
        </div>
      </section>

      {/* Ready to Hit the Road CTA */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1400" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative py-16 text-center">
          <h2 className="text-3xl font-bold font-heading text-white">Ready to Hit the Road?</h2>
          <p className="text-white/80 mt-2 max-w-md mx-auto">Browse our full inventory and find the RV that fits your lifestyle and budget.</p>
          <Button size="lg" variant="secondary" className="mt-6" asChild><Link to="/inventory">Browse All Inventory</Link></Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
