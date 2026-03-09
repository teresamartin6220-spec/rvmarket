import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Gauge, Users, Cog, Shield, Globe, Hash, AlertTriangle, Heart } from "lucide-react";
import { companyInfo, DISCLAIMER } from "@/data/mockData";
import { ImageGallery } from "@/components/rv/ImageGallery";
import { ShareButton } from "@/components/rv/ShareButton";
import { FinancingCalculator } from "@/components/rv/FinancingCalculator";
import { ContactForm } from "@/components/rv/ContactForm";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { useListingById } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const overviewSpecs: Array<{ key: string; icon: typeof Calendar; label: string; format?: (v: any) => string }> = [
  { key: "year", icon: Calendar, label: "Year" },
  { key: "mileage", icon: Gauge, label: "Mileage", format: (v: number) => `${v.toLocaleString()} mi` },
  { key: "sleeps", icon: Users, label: "Sleeps" },
  { key: "vin", icon: Hash, label: "VIN #" },
  { key: "condition", icon: Shield, label: "Condition" },
];

const RVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { listing: rv, loading } = useListingById(id);
  const { format } = useCurrency();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("rv_id", id)
      .then(({ data }) => {
        if (data && data.length > 0) setIsSaved(true);
      });
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to save RVs");
      return;
    }
    if (!id) return;

    if (isSaved) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("rv_id", id);
      setIsSaved(false);
      toast.success("Removed from saved RVs");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, rv_id: id });
      setIsSaved(true);
      toast.success("Saved to your portal!");
    }
  };

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!rv) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold font-heading">RV Not Found</h1>
        <Button className="mt-4" asChild><Link to="/inventory">Back to Inventory</Link></Button>
      </div>
    );
  }

  const specs = rv.specs && typeof rv.specs === "object" ? rv.specs as Record<string, any> : {};
  const features = rv.features && typeof rv.features === "object" ? rv.features as Record<string, any> : {};

  const specEntries = [
    { label: "Sleeping Capacity", value: specs.sleepingCapacity ? `${specs.sleepingCapacity} people` : null },
    { label: "Generator", value: specs.generator },
    { label: "Fuel Tank Capacity", value: specs.fuelTankCapacity },
    { label: "Fresh Water Capacity", value: specs.freshWaterCapacity },
    { label: "LPG Capacity", value: specs.lpgCapacity },
    { label: "Grey Tank Capacity", value: specs.greyTankCapacity },
    { label: "Black Tank Capacity", value: specs.blackTankCapacity },
    { label: "Hot Water Capacity", value: specs.hotWaterCapacity },
    { label: "GVWR", value: specs.gvwr },
    { label: "Exterior Length", value: specs.exteriorLength },
    { label: "Exterior Height", value: specs.exteriorHeight },
    { label: "Exterior Width", value: specs.exteriorWidth },
  ].filter(e => e.value);

  const rvData: Record<string, any> = {
    year: rv.year,
    mileage: rv.mileage,
    sleeps: rv.sleeps,
    vin: rv.vin || "N/A",
    transmission: rv.transmission || "N/A",
    condition: rv.condition || "N/A",
  };

  const featureSections = [
    { key: "coachFeatures", label: "Coach Features" },
    { key: "chassisFeatures", label: "Chassis Features" },
    { key: "coachConstruction", label: "Coach Construction" },
    { key: "safetyFeatures", label: "Safety Features" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="border-b bg-card">
        <div className="container py-3">
          <Link to="/inventory" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>{rv.brand}</span>
                  <span>·</span>
                  <span>Stock #{rv.stock_number || "N/A"}</span>
                  <span>·</span>
                  <span>VIN: {rv.vin || "N/A"}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{rv.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 text-sm"><MapPin className="h-4 w-4" /> {rv.location || "N/A"}</span>
                  <span className="flex items-center gap-1 text-sm"><Globe className="h-4 w-4" /> {rv.country || "N/A"}</span>
                  {rv.sales_pro && <span className="text-sm font-medium text-primary">🧑‍💼 {rv.sales_pro}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleWishlist}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                    isSaved ? "bg-destructive/10 border-destructive text-destructive" : "hover:bg-muted"
                  }`}
                  title={isSaved ? "Remove from saved" : "Save RV"}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                </button>
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted"><Icon className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold text-foreground">{fmt ? fmt(value) : String(value)}</p>
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

            {featureSections.some(s => features[s.key]?.length > 0) && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-heading text-foreground">Features & Equipment</h2>
                {featureSections.map(({ key, label }) => {
                  const items = features[key];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={key}>
                      <h3 className="font-heading font-semibold text-foreground mb-2">{label}</h3>
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground">Listed Price</p>
              <p className="text-4xl font-bold font-heading text-primary mt-1">{format(rv.price)}</p>
              <Button className="w-full mt-4" size="lg" asChild><a href="#contact">Contact Us</a></Button>
              <Button variant="outline" className="w-full mt-2" size="lg" asChild><a href="#financing">Apply for Financing</a></Button>
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
            <div id="contact"><ContactForm rvTitle={rv.title} rvId={rv.id} /></div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget rvId={rv.id} rvTitle={rv.title} salesPro={rv.sales_pro || undefined} />
    </motion.div>
  );
};

export default RVDetail;
