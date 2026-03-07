import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Gauge, Users, Ruler, Fuel, Cog, Shield } from "lucide-react";
import { getRVById, getDealerById } from "@/data/mockData";
import { ImageGallery } from "@/components/rv/ImageGallery";
import { ShareButton } from "@/components/rv/ShareButton";
import { FinancingCalculator } from "@/components/rv/FinancingCalculator";
import { ContactForm } from "@/components/rv/ContactForm";
import { Button } from "@/components/ui/button";

const specs: Array<{ key: string; icon: typeof Calendar; label: string; format?: (v: any) => string }> = [
  { key: "year", icon: Calendar, label: "Year" },
  { key: "mileage", icon: Gauge, label: "Mileage", format: (v: number) => `${v.toLocaleString()} mi` },
  { key: "sleeps", icon: Users, label: "Sleeps" },
  { key: "length", icon: Ruler, label: "Length" },
  { key: "fuelType", icon: Fuel, label: "Fuel" },
  { key: "transmission", icon: Cog, label: "Transmission" },
  { key: "condition", icon: Shield, label: "Condition" },
];

const RVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const rv = getRVById(id || "");
  const dealer = rv ? getDealerById(rv.dealerId) : undefined;

  if (!rv || !dealer) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold font-heading">RV Not Found</h1>
        <Button className="mt-4" asChild><Link to="/inventory">Back to Inventory</Link></Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container py-3">
          <Link to="/inventory" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{rv.brand}</span>
                  <span>·</span>
                  <span>Stock #{rv.stockNumber}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{rv.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{rv.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShareButton title={rv.title} />
                <p className="text-3xl font-bold font-heading text-primary">${rv.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Gallery */}
            <ImageGallery images={rv.images} title={rv.title} />

            {/* Specs Grid */}
            <div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-4">RV Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {specs.map(({ key, icon: Icon, label, format }) => {
                  const value = rv[key as keyof typeof rv];
                  return (
                    <div key={key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {format ? format(value as number) : String(value)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{rv.description}</p>
            </div>

            {/* Financing */}
            <FinancingCalculator price={rv.price} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-lg border bg-card p-6 text-center lg:sticky lg:top-20">
              <p className="text-sm text-muted-foreground">Listed Price</p>
              <p className="text-4xl font-bold font-heading text-primary mt-1">${rv.price.toLocaleString()}</p>
              <Button className="w-full mt-4" size="lg" asChild>
                <a href="#contact">Contact Dealer</a>
              </Button>
              <Button variant="outline" className="w-full mt-2" size="lg" asChild>
                <a href="#financing">Apply for Financing</a>
              </Button>
            </div>

            {/* Dealer Info */}
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <h3 className="font-heading font-semibold text-foreground">{dealer.name}</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {dealer.address}, {dealer.city}, {dealer.state}</p>
                <p>📞 {dealer.phone}</p>
                <p>✉️ {dealer.email}</p>
                <p>🕐 {dealer.hours}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div id="contact">
              <ContactForm dealer={dealer} rvTitle={rv.title} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RVDetail;
