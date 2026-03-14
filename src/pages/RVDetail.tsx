import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Users, Cog, Shield, Globe, Hash, AlertTriangle } from "lucide-react";
import { companyInfo, DISCLAIMER } from "@/data/mockData";
import { ImageGallery } from "@/components/rv/ImageGallery";
import { ShareButton } from "@/components/rv/ShareButton";
import { FinancingCalculator } from "@/components/rv/FinancingCalculator";
import { ContactForm } from "@/components/rv/ContactForm";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { useListingById } from "@/hooks/useListings";

const overviewSpecs: Array<{ key: string; icon: typeof Calendar; label: string; format?: (v: any) => string }> = [
  { key: "year", icon: Calendar, label: "Year" },
  { key: "sleeps", icon: Users, label: "Sleeps" },
  { key: "condition", icon: Shield, label: "Condition" },
];

const RVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { listing: rv, loading } = useListingById(id);
  const { format } = useCurrency();

  if (loading) {
    return <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!rv) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold font-heading">RV Not Found</h1>
        <Button className="mt-4" asChild><Link to="/inventory">Back to Inventory</Link></Button>
      </div>
    );
  }

  const specs = rv.specs && typeof rv.specs === "object" ? rv.specs as Record<string, any> : {};
  const features = rv.features && typeof rv.features === "object" ? rv.features as Record<string, any> : {};

  const specEntries = [
    { label: "VIN", value: specs.vin || rv.vin },
    { label: "Generator", value: specs.generator },
    { label: "Fuel Tank Capacity (gal)", value: specs.fuelTankCapacity },
    { label: "Fresh Water Capacity (gal)", value: specs.freshWaterCapacity },
    { label: "LPG Capacity (gal)", value: specs.lpgCapacity },
    { label: "Grey Tank Capacity (gal)", value: specs.greyTankCapacity },
    { label: "Black Tank Capacity (gal)", value: specs.blackTankCapacity },
    { label: "Hot Water Capacity (gal)", value: specs.hotWaterCapacity },
    { label: "GVWR (lbs)", value: specs.gvwr },
    { label: "Exterior Length (ft)", value: specs.exteriorLength },
    { label: "Exterior Height (ft)", value: specs.exteriorHeight },
    { label: "Exterior Width (ft)", value: specs.exteriorWidth },
  ].filter(e => e.value);

  const rvData: Record<string, any> = {
    year: rv.year,
    mileage: rv.mileage,
    sleeps: rv.sleeps,
    condition: rv.condition || "N/A",
  };

  const featureSections = [
    { key: "coachFeatures", label: "Coach Features" },
    { key: "chassisFeatures", label: "Chassis Features" },
    { key: "coachConstruction", label: "Coach Construction" },
    { key: "safetyFeatures", label: "Safety Features" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen overflow-x-hidden">
      <div className="border-b bg-card">
        <div className="w-full max-w-7xl mx-auto px-4 py-3">
          <Link to="/inventory" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8 overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-full overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{rv.brand}</span>
                  <span>·</span>
                  <span>Stock #{rv.stock_number || "N/A"}</span>
                  
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground break-words">{rv.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 text-sm"><MapPin className="h-4 w-4" /> {rv.location || "N/A"}</span>
                  <span className="flex items-center gap-1 text-sm"><Globe className="h-4 w-4" /> {rv.country || "N/A"}</span>
                  
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <ShareButton title={rv.title} />
                <p className="text-3xl font-bold font-heading text-primary">{format(rv.price)}</p>
              </div>
            </div>

            <ImageGallery images={rv.images || []} title={rv.title} />

            <div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-4">RV Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {overviewSpecs.map(({ key, icon: Icon, label, format: fmt }) => {
                  const value = rvData[key];
                  return (
                    <div key={key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{fmt ? fmt(value) : String(value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{rv.description}</p>
            </div>

            {specEntries.length > 0 && (
              <div>
                <h2 className="text-xl font-bold font-heading text-foreground mb-4">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                  {specEntries.map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b text-sm">
                      <span className="text-muted-foreground pr-2">{label}</span>
                      <span className="font-medium text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featureSections.some(s => features[s.key]?.length > 0) && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-heading text-foreground">Features & Equipment</h2>
                {featureSections.map(({ key, label }) => {
                  const items = features[key];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={key}>
                      <h3 className="font-heading font-semibold text-foreground mb-2">{label}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        {items.map((f: string) => <li key={f} className="flex items-center gap-2">• {f}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            <FinancingCalculator price={rv.price} rvTitle={rv.title} rvId={rv.id} />

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{DISCLAIMER}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 text-center lg:sticky lg:top-20">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Available for Sale</p>
              <p className="text-4xl font-bold font-heading text-primary mt-1">{format(rv.price)}</p>
              <p className="text-xs text-muted-foreground mt-1">Buy outright or finance — contact us to get started</p>
              <Button className="w-full mt-4" size="lg" asChild><a href="#contact">Buy Now — Contact Us</a></Button>
              <Button variant="outline" className="w-full mt-2" size="lg" asChild><a href="#financing">Explore Financing Options</a></Button>
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
            <div id="contact"><ContactForm rvTitle={rv.title} rvId={rv.id} stockNumber={rv.stock_number} /></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RVDetail;
