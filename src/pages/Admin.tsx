import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RV_TYPES } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASS = "rvmarket2024";

interface DBListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  stock_number: string | null;
  vin: string | null;
  price: number;
  mileage: number;
  sleeps: number;
  transmission: string | null;
  condition: string | null;
  type: string;
  description: string | null;
  location: string | null;
  country: string | null;
  images: string[];
  specs: any;
  features: any;
  is_sold: boolean | null;
}

const emptyListing: Partial<DBListing> = {
  title: "", brand: "", model: "", year: 2024, stock_number: "", vin: "",
  price: 0, mileage: 0, sleeps: 4, transmission: "Automatic",
  condition: "Excellent", type: "THOR MAJESTIC 23A",
  description: "", location: "", country: "USA", images: [], is_sold: false,
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="rounded-lg border bg-card p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold font-heading text-foreground text-center">Admin Login</h1>
        <div>
          <Label>Password</Label>
          <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && pass === ADMIN_PASS && onLogin()} />
        </div>
        <Button className="w-full" onClick={() => { if (pass === ADMIN_PASS) onLogin(); else toast.error("Invalid password"); }}>
          Login
        </Button>
      </div>
    </div>
  );
}

function RVForm({ listing, onSave, onCancel }: { listing: Partial<DBListing>; onSave: (l: Partial<DBListing>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<DBListing>>({ ...listing });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

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
      if (newImages.length >= 7) break;
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("rv-images").upload(fileName, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("rv-images").getPublicUrl(data.path);
      newImages.push(urlData.publicUrl);
    }

    update("images", newImages);
    setUploading(false);
    toast.success("Images uploaded!");
  };

  const removeImage = (idx: number) => {
    update("images", (form.images || []).filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
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
        <div><Label>VIN #</Label><Input value={form.vin || ""} onChange={(e) => update("vin", e.target.value)} /></div>
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
        <div><Label>Location</Label><Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Denver, CO" /></div>
        <div>
          <Label>Country</Label>
          <Select value={form.country || "USA"} onValueChange={(v) => update("country", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["USA", "Canada", "UK", "Australia"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_sold || false} onChange={(e) => update("is_sold", e.target.checked)} className="rounded" />
            Mark as Sold
          </Label>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} />
      </div>

      {/* Images */}
      <div>
        <Label>Images (up to 7)</Label>
        <div className="flex gap-2 mt-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1" />
          <Button type="button" variant="outline" onClick={addImage} disabled={(form.images?.length || 0) >= 7}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
            <Image className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload from device"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading || (form.images?.length || 0) >= 7} />
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

      <div className="flex gap-3">
        <Button onClick={() => onSave(form)}>Save RV</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [editingRV, setEditingRV] = useState<Partial<DBListing> | null>(null);
  const [listings, setListings] = useState<DBListing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rv_listings").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load listings"); console.error(error); }
    else setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchListings(); }, [authed]);

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
      is_sold: rv.is_sold || false,
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
        {editingRV ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-bold font-heading text-foreground mb-4">{editingRV.id ? "Edit RV" : "Add New RV"}</h2>
            <RVForm listing={editingRV} onSave={handleSave} onCancel={() => setEditingRV(null)} />
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{listings.length} listing(s) in database</p>
              <Button onClick={() => setEditingRV({ ...emptyListing })}>
                <Plus className="h-4 w-4 mr-2" /> Add RV
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Upload className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No listings yet. Click "Add RV" to create one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((rv) => (
                  <div key={rv.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                    {rv.images && rv.images[0] && (
                      <img src={rv.images[0]} alt={rv.title} className="h-16 w-24 rounded object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {rv.title}
                        {rv.is_sold && <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded">SOLD</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{rv.type} · {rv.year} · ${rv.price?.toLocaleString()} · {rv.country}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
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
      </div>
    </div>
  );
};

export default Admin;
