import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, X, Image, BarChart3, Copy, FileText, EyeOff, Eye, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RV_TYPES, US_LOCATIONS } from "@/data/mockData";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import type { DBListing } from "@/hooks/useListings";



const TOGGLEABLE_SPEC_FIELDS = [
  { key: "vin", label: "VIN #", placeholder: "Enter VIN number" },
  { key: "generator", label: "Generator", placeholder: "e.g. 4KW Onan Microlite" },
  { key: "fuelTankCapacity", label: "Fuel Tank Capacity (gal)", placeholder: "e.g. 55" },
  { key: "freshWaterCapacity", label: "Fresh Water Capacity (gal)", placeholder: "e.g. 40" },
  { key: "lpgCapacity", label: "LPG Capacity (gal)", placeholder: "e.g. 12.2" },
  { key: "greyTankCapacity", label: "Grey Tank Capacity (gal)", placeholder: "e.g. 22" },
  { key: "blackTankCapacity", label: "Black Tank Capacity (gal)", placeholder: "e.g. 25" },
  { key: "hotWaterCapacity", label: "Hot Water Capacity (gal)", placeholder: "e.g. 6" },
  { key: "gvwr", label: "GVWR (lbs)", placeholder: "e.g. 12,500" },
  { key: "exteriorLength", label: "Exterior Length (ft)", placeholder: "e.g. 25" },
  { key: "exteriorHeight", label: "Exterior Height (ft)", placeholder: "e.g. 10.7" },
  { key: "exteriorWidth", label: "Exterior Width (ft)", placeholder: "e.g. 8.3" },
];

const FEATURE_SECTIONS = [
  { key: "coachFeatures", label: "Coach Features" },
  { key: "chassisFeatures", label: "Chassis Features" },
  { key: "coachConstruction", label: "Coach Construction" },
  { key: "safetyFeatures", label: "Safety Features" },
];

const emptyListing: Partial<DBListing> = {
  title: "", brand: "", model: "", year: 2024, stock_number: "", vin: "",
  price: 0, mileage: 0, sleeps: 4, transmission: "Automatic",
  condition: "Excellent", type: "THOR MAJESTIC 23A",
  description: "", location: "", country: "USA", images: [], is_sold: false, is_super_special: false, is_featured: false, is_hidden: false, sales_pro: null,
  specs: {}, features: {},
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState("");
  const [checking, setChecking] = useState(false);

  const handleLogin = async () => {
    if (!pass.trim()) return;
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-login", {
        body: { password: pass },
      });
      if (error) { toast.error("Login failed"); return; }
      if (data?.valid) onLogin();
      else toast.error("Invalid password");
    } catch {
      toast.error("Login failed");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="rounded-lg border bg-card p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold font-heading text-foreground text-center">Admin Login</h1>
        <div>
          <Label>Password</Label>
          <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        <Button className="w-full" onClick={handleLogin} disabled={checking}>
          {checking ? "Checking..." : "Login"}
        </Button>
      </div>
    </div>
  );
}

function RVForm({ listing, onSave, onCancel }: { listing: Partial<DBListing>; onSave: (l: Partial<DBListing>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<DBListing>>({
    ...listing,
    specs: listing.specs && typeof listing.specs === "object" ? listing.specs : {},
    features: listing.features && typeof listing.features === "object" ? listing.features : {},
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateSpec = (key: string, value: string) => setForm((prev) => ({ ...prev, specs: { ...(prev.specs || {}), [key]: value } }));
  const updateFeatureList = (sectionKey: string, value: string) => {
    const items = value.split("\n").filter(Boolean);
    setForm((prev) => ({ ...prev, features: { ...(prev.features || {}), [sectionKey]: items } }));
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      update("images", [...(form.images || []), imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages = [...(form.images || [])];
    for (const file of Array.from(files)) {
      if (newImages.length >= 30) break;
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("rv-images").upload(fileName, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("rv-images").getPublicUrl(data.path);
      newImages.push(urlData.publicUrl);
    }
    update("images", newImages);
    setUploading(false);
    toast.success("Images uploaded!");
  };

  const removeImage = (idx: number) => update("images", (form.images || []).filter((_, i) => i !== idx));

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Basic Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Thor Majestic 23A" /></div>
          <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => update("brand", e.target.value)} /></div>
          <div><Label>Model</Label><Input value={form.model} onChange={(e) => update("model", e.target.value)} /></div>
          <div>
            <Label>RV Type / Category</Label>
            <Select value={form.type} onValueChange={(v) => update("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RV_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} /></div>
          <div><Label>Stock Number</Label><Input value={form.stock_number || ""} onChange={(e) => update("stock_number", e.target.value)} /></div>
          <div><Label>VIN #</Label><Input value={form.vin || ""} onChange={(e) => update("vin", e.target.value)} placeholder="Enter VIN number" /></div>
          <div><Label>Price (USD)</Label><Input type="number" value={form.price} onChange={(e) => update("price", Number(e.target.value))} /></div>
          <div><Label>Mileage</Label><Input type="number" value={form.mileage} onChange={(e) => update("mileage", Number(e.target.value))} /></div>
          <div><Label>Sleeps</Label><Input type="number" value={form.sleeps} onChange={(e) => update("sleeps", Number(e.target.value))} /></div>
          <div><Label>Transmission</Label><Input value={form.transmission || ""} onChange={(e) => update("transmission", e.target.value)} /></div>
          <div>
            <Label>Condition</Label>
            <Select value={form.condition || "Excellent"} onValueChange={(v) => update("condition", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Like New", "Excellent", "Good", "Fair"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Location</Label>
            <Select value={form.location || ""} onValueChange={(v) => update("location", v)}>
              <SelectTrigger><SelectValue placeholder="Select location..." /></SelectTrigger>
              <SelectContent>{US_LOCATIONS.map((loc) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Country</Label>
            <Select value={form.country || "USA"} onValueChange={(v) => update("country", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["USA", "Canada", "UK", "Australia"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-4 flex-wrap">
            <Label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_sold || false} onChange={(e) => update("is_sold", e.target.checked)} className="rounded" />
              Mark as Sold
            </Label>
            <Label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_super_special || false} onChange={(e) => update("is_super_special", e.target.checked)} className="rounded accent-amber-500" />
              ⭐ Super Special
            </Label>
            <Label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured || false} onChange={(e) => update("is_featured", e.target.checked)} className="rounded" />
              ⭐ Featured on Homepage
            </Label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Description</h3>
        <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={5} placeholder="Full RV description..." />
      </div>

      {/* Images */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Images (up to 30)</h3>
        <div className="flex gap-2 mt-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1" />
          <Button type="button" variant="outline" onClick={addImage} disabled={(form.images?.length || 0) >= 30}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
            <Image className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload from device"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading || (form.images?.length || 0) >= 30} />
          </label>
        </div>
        {form.images && form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group h-20 w-28 rounded-md overflow-hidden border">
                <img src={img} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specifications */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Specifications</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALWAYS_VISIBLE_SPEC_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={(form.specs as any)?.[key] || ""}
                onChange={(e) => updateSpec(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <h4 className="font-heading font-medium text-foreground mt-6 mb-3">Optional Specs (toggle to enable)</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOGGLEABLE_SPEC_FIELDS.map(({ key, label, placeholder }) => {
            const hasValue = !!(form.specs as any)?.[key];
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>{label}</Label>
                  <Switch
                    checked={hasValue}
                    onCheckedChange={(checked) => {
                      if (!checked) updateSpec(key, "");
                    }}
                  />
                </div>
                {hasValue || true ? (
                  <Input
                    value={(form.specs as any)?.[key] || ""}
                    onChange={(e) => updateSpec(key, e.target.value)}
                    placeholder={placeholder}
                    disabled={false}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Features & Equipment</h3>
        <p className="text-xs text-muted-foreground mb-4">Enter one feature per line</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURE_SECTIONS.map(({ key, label }) => (
            <div key={key}>
              <Label>{label}</Label>
              <Textarea
                value={((form.features as any)?.[key] || []).join("\n")}
                onChange={(e) => updateFeatureList(key, e.target.value)}
                rows={6}
                placeholder={`Enter ${label.toLowerCase()}, one per line...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onSave(form)}>Save RV</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"financing" | "inquiries">("financing");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: fin }, { data: inq }] = await Promise.all([
        supabase.from("financing_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      ]);
      setApps(fin || []);
      setInquiries(inq || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={tab === "financing" ? "default" : "outline"} size="sm" onClick={() => setTab("financing")}>
          Financing Applications ({apps.length})
        </Button>
        <Button variant={tab === "inquiries" ? "default" : "outline"} size="sm" onClick={() => setTab("inquiries")}>
          Inquiries ({inquiries.length})
        </Button>
      </div>

      {tab === "financing" && (
        <div className="space-y-3">
          {apps.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No financing applications yet.</p>
          ) : apps.map((app) => (
            <div key={app.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.email}{app.phone && ` · ${app.phone}`}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</span>
              </div>
              {app.rv_title && <p className="text-sm text-foreground">RV: {app.rv_title}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {app.rv_price != null && <span>Price: ${Number(app.rv_price).toLocaleString()}</span>}
                {app.down_payment != null && <span>Down: ${Number(app.down_payment).toLocaleString()}</span>}
                {app.loan_term && <span>Term: {app.loan_term} mo</span>}
                {app.estimated_monthly != null && <span>Est. Monthly: ${Number(app.estimated_monthly).toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "inquiries" && (
        <div className="space-y-3">
          {inquiries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No inquiries yet.</p>
          ) : inquiries.map((inq) => (
            <div key={inq.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{inq.name}</p>
                  <p className="text-sm text-muted-foreground">{inq.email}{inq.phone && ` · ${inq.phone}`}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString()}</span>
              </div>
              {inq.rv_title && <p className="text-sm text-foreground">RV: {inq.rv_title}</p>}
              {inq.message && <p className="text-sm text-muted-foreground">{inq.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
];

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [editingRV, setEditingRV] = useState<Partial<DBListing> | null>(null);
  const [listings, setListings] = useState<DBListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rv_listings").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load listings"); console.error(error); }
    else setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchListings(); }, [authed]);

  const filteredListings = listings.filter((rv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (rv.vin || "").toLowerCase().includes(q) || (rv.stock_number || "").toLowerCase().includes(q);
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "oldest": return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case "az": return (a.title || "").localeCompare(b.title || "");
      case "za": return (b.title || "").localeCompare(a.title || "");
      case "price-high": return (b.price || 0) - (a.price || 0);
      case "price-low": return (a.price || 0) - (b.price || 0);
      default: return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const handleSave = async (rv: Partial<DBListing>) => {
    if (!rv.title || !rv.brand || !rv.price) {
      toast.error("Title, brand, and price are required");
      return;
    }

    const payload = {
      title: rv.title,
      brand: rv.brand,
      model: rv.model || "",
      year: rv.year || 2024,
      stock_number: rv.stock_number || null,
      vin: rv.vin || null,
      price: rv.price,
      mileage: rv.mileage || 0,
      sleeps: rv.sleeps || 4,
      transmission: rv.transmission || "Automatic",
      condition: rv.condition || "Excellent",
      type: rv.type || "THOR MAJESTIC 23A",
      description: rv.description || null,
      location: rv.location || null,
      country: rv.country || "USA",
      images: rv.images || [],
      specs: rv.specs || {},
      features: rv.features || {},
      is_sold: rv.is_sold || false,
      is_super_special: rv.is_super_special || false,
      is_featured: rv.is_featured || false,
      is_hidden: rv.is_hidden || false,
      sales_pro: rv.sales_pro || null,
    };

    if (rv.id) {
      const { error } = await supabase.from("rv_listings").update(payload).eq("id", rv.id);
      if (error) { toast.error("Failed to update"); console.error(error); return; }
      toast.success("RV updated");
    } else {
      const { error } = await supabase.from("rv_listings").insert(payload);
      if (error) { toast.error("Failed to add"); console.error(error); return; }
      toast.success("RV added");
    }
    setEditingRV(null);
    fetchListings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase.from("rv_listings").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("RV deleted");
    fetchListings();
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold font-heading text-foreground">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={() => setAuthed(false)}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Applications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {editingRV ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-bold font-heading text-foreground mb-4">{editingRV.id ? "Edit RV" : "Add New RV"}</h2>
                <RVForm listing={editingRV} onSave={handleSave} onCancel={() => setEditingRV(null)} />
              </motion.div>
            ) : (
              <>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                   <p className="text-muted-foreground">{filteredListings.length} of {listings.length} listing(s)</p>
                   <div className="flex flex-wrap items-center gap-3">
                     <Input
                       placeholder="Search VIN or Stock #..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-[200px]"
                     />
                     <Select value={sortBy} onValueChange={setSortBy}>
                       <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                       <SelectContent>{SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                     </Select>
                     <Button onClick={() => setEditingRV({ ...emptyListing })}>
                       <Plus className="h-4 w-4 mr-2" /> Add RV
                     </Button>
                   </div>
                 </div>

                {loading ? (
                  <div className="text-center py-16 text-muted-foreground">Loading...</div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>No listings yet. Click "Add RV" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                     {sortedListings.map((rv) => (
                      <div key={rv.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                        {rv.images && rv.images[0] && (
                          <img src={rv.images[0]} alt={rv.title} className="h-16 w-24 rounded object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {rv.title}
                            {rv.is_sold && <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded">SOLD</span>}
                            {rv.is_super_special && <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded">⭐ SPECIAL</span>}
                            {rv.is_featured && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">⭐ FEATURED</span>}
                            {rv.is_hidden && <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">HIDDEN</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{rv.type} · {rv.year} · ${rv.price?.toLocaleString()} · {rv.country}</p>
                          <p className="text-xs text-muted-foreground">{rv.location && `📍 ${rv.location}`}{rv.vin && ` · VIN: ${rv.vin}`}{rv.stock_number && ` · Stock #${rv.stock_number}`}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" onClick={async () => {
                            const newHidden = !rv.is_hidden;
                            const { error } = await supabase.from("rv_listings").update({ is_hidden: newHidden }).eq("id", rv.id);
                            if (error) { toast.error("Failed to toggle visibility"); return; }
                            toast.success(newHidden ? "Vehicle hidden" : "Vehicle visible");
                            fetchListings();
                          }} title={rv.is_hidden ? "Unhide" : "Hide"}>
                            {rv.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingRV({ ...rv, id: undefined, title: `${rv.title} (Copy)`, stock_number: null, vin: null })} title="Duplicate">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingRV({ ...rv })}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(rv.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
