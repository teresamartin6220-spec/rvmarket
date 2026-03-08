import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Gauge, Users, Cog, Shield, Globe, Hash, AlertTriangle } from "lucide-react";
import { getRVById, companyInfo, DISCLAIMER } from "@/data/mockData";
import { ImageGallery } from "@/components/rv/ImageGallery";
import { ShareButton } from "@/components/rv/ShareButton";
import { FinancingCalculator } from "@/components/rv/FinancingCalculator";
import { ContactForm } from "@/components/rv/ContactForm";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

const specs: Array<{ key: string; icon: typeof Calendar; label: string; format?: (v: any) => string }> = [
  { key: "year", icon: Calendar, label: "Year" },
  { key: "mileage", icon: Gauge, label: "Mileage", format: (v: number) => `${v.toLocaleString()} mi` },
  { key: "sleeps", icon: Users, label: "Sleeps" },
  { key: "vin", icon: Hash, label: "VIN #" },
  { key: "transmission", icon: Cog, label: "Transmission" },
  { key: "condition", icon: Shield, label: "Condition" },
];

const RVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const rv = getRVById(id || "");
  const { format } = useCurrency();

  if (!rv) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold font-heading">RV Not Found</h1>
        <Button className="mt-4" asChild><Link to="/inventory">Back to Inventory</Link></Button>
      </div>
    );
  }

  const specEntries = rv.specs ? [
    { label: "Sleeping Capacity", value: `${rv.specs.sleepingCapacity} people` },
    { label: "Generator", value: rv.specs.generator },
    { label: "Fuel Tank Capacity", value: rv.specs.fuelTankCapacity },
    { label: "Fresh Water Capacity", value: rv.specs.freshWaterCapacity },
    { label: "LPG Capacity", value: rv.specs.lpgCapacity },
    { label: "Grey Tank Capacity", value: rv.specs.greyTankCapacity },
    { label: "Black Tank Capacity", value: rv.specs.blackTankCapacity },
    { label: "Hot Water Capacity", value: rv.specs.hotWaterCapacity },
    { label: "GVWR", value: rv.specs.gvwr },
    { label: "Exterior Length", value: rv.specs.exteriorLength },
    { label: "Exterior Height", value: rv.specs.exteriorHeight },
    { label: "Exterior Width", value: rv.specs.exteriorWidth },
  ].filter(e => e.value) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
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
                  <span>·</span>
                  <span>VIN: {rv.vin}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{rv.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 text-sm"><MapPin className="h-4 w-4" /> {rv.location}</span>
                  <span className="flex items-center gap-1 text-sm"><Globe className="h-4 w-4" /> {rv.country}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShareButton title={rv.title} />
                <p className="text-3xl font-bold font-heading text-primary">{format(rv.price)}</p>
              </div>
            </div>

            {/* Gallery */}
            <ImageGallery images={rv.images} title={rv.title} />

            {/* Quick Specs Grid */}
            <div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-4">RV Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ key, icon: Icon, label, format: fmt }) => {
                  const value = rv[key as keyof typeof rv];
                  return (
                    <div key={key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {fmt ? fmt(value as number) : String(value)}
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

            {/* Specifications */}
            {specEntries.length > 0 && (
              <div>
                <h2 className="text-xl font-bold font-heading text-foreground mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {specEntries.map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {rv.features && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-heading text-foreground">Features & Equipment</h2>
                {rv.features.coachFeatures && rv.features.coachFeatures.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Coach Features</h3>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      {rv.features.coachFeatures.map((f) => <li key={f} className="flex items-center gap-2">• {f}</li>)}
                    </ul>
                  </div>
                )}
                {rv.features.chassisFeatures && rv.features.chassisFeatures.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Chassis Features</h3>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      {rv.features.chassisFeatures.map((f) => <li key={f} className="flex items-center gap-2">• {f}</li>)}
                    </ul>
                  </div>
                )}
                {rv.features.coachConstruction && rv.features.coachConstruction.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Coach Construction</h3>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      {rv.features.coachConstruction.map((f) => <li key={f} className="flex items-center gap-2">• {f}</li>)}
                    </ul>
                  </div>
                )}
                {rv.features.safetyFeatures && rv.features.safetyFeatures.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Safety Features</h3>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      {rv.features.safetyFeatures.map((f) => <li key={f} className="flex items-center gap-2">• {f}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Financing */}
            <FinancingCalculator price={rv.price} />

            {/* Disclaimer */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{DISCLAIMER}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 text-center lg:sticky lg:top-20">
              <p className="text-sm text-muted-foreground">Listed Price</p>
              <p className="text-4xl font-bold font-heading text-primary mt-1">{format(rv.price)}</p>
              <Button className="w-full mt-4" size="lg" asChild>
                <a href="#contact">Contact Us</a>
              </Button>
              <Button variant="outline" className="w-full mt-2" size="lg" asChild>
                <a href="#financing">Apply for Financing</a>
              </Button>
            </div>

            <div className="rounded-lg border bg-card p-6 space-y-3">
              <h3 className="font-heading font-semibold text-foreground">{companyInfo.name}</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {companyInfo.address}, {companyInfo.city}, {companyInfo.state}</p>
                <p>📞 {companyInfo.phone}</p>
                <p>✉️ {companyInfo.email}</p>
                <p>🕐 {companyInfo.hours}</p>
              </div>
            </div>

            <div id="contact">
              <ContactForm rvTitle={rv.title} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RVDetail;
