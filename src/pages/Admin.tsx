import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RV_TYPES, type RV, type RVType } from "@/data/mockData";
import { toast } from "sonner";

const ADMIN_PASS = "rvmarket2024";

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

const emptyRV: Partial<RV> = {
  title: "", brand: "", model: "", year: 2024, stockNumber: "", vin: "",
  price: 0, mileage: 0, sleeps: 4, transmission: "Automatic",
  condition: "Excellent", type: "THOR MAJESTIC 23A" as RVType,
  description: "", location: "", country: "USA", images: [],
};

function RVForm({ rv, onSave, onCancel }: { rv: Partial<RV>; onSave: (rv: Partial<RV>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<RV>>({ ...rv });
  const [imageUrl, setImageUrl] = useState("");

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const addImage = () => {
    if (imageUrl.trim()) {
      update("images", [...(form.images || []), imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (idx: number) => {
    update("images", (form.images || []).filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Thor Majestic 23A" />
        </div>
        <div>
          <Label>Brand</Label>
          <Input value={form.brand} onChange={(e) => update("brand", e.target.value)} />
        </div>
        <div>
          <Label>Model</Label>
          <Input value={form.model} onChange={(e) => update("model", e.target.value)} />
        </div>
        <div>
          <Label>RV Type / Category</Label>
          <Select value={form.type} onValueChange={(v) => update("type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {RV_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Year</Label>
          <Input type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} />
        </div>
        <div>
          <Label>Stock Number</Label>
          <Input value={form.stockNumber} onChange={(e) => update("stockNumber", e.target.value)} />
        </div>
        <div>
          <Label>VIN #</Label>
          <Input value={form.vin} onChange={(e) => update("vin", e.target.value)} />
        </div>
        <div>
          <Label>Price (USD)</Label>
          <Input type="number" value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
        </div>
        <div>
          <Label>Mileage</Label>
          <Input type="number" value={form.mileage} onChange={(e) => update("mileage", Number(e.target.value))} />
        </div>
        <div>
          <Label>Sleeps</Label>
          <Input type="number" value={form.sleeps} onChange={(e) => update("sleeps", Number(e.target.value))} />
        </div>
        <div>
          <Label>Transmission</Label>
          <Input value={form.transmission} onChange={(e) => update("transmission", e.target.value)} />
        </div>
        <div>
          <Label>Condition</Label>
          <Select value={form.condition} onValueChange={(v) => update("condition", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Like New", "Excellent", "Good", "Fair"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Location</Label>
          <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Denver, CO" />
        </div>
        <div>
          <Label>Country</Label>
          <Select value={form.country} onValueChange={(v) => update("country", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["USA", "Canada", "UK", "Australia"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
      </div>

      {/* Images */}
      <div>
        <Label>Images (up to 7 — paste URLs or upload)</Label>
        <div className="flex gap-2 mt-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1" />
          <Button type="button" variant="outline" onClick={addImage} disabled={(form.images?.length || 0) >= 7}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Tip: Upload images to any image host (e.g. Imgur, Cloudinary) and paste the URL. You can also edit mockData.ts to import local images.</p>
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
  const [editingRV, setEditingRV] = useState<Partial<RV> | null>(null);
  const [listings, setListings] = useState<Partial<RV>[]>(() => {
    const stored = localStorage.getItem("rv_admin_listings");
    return stored ? JSON.parse(stored) : [];
  });

  const save = (updatedListings: Partial<RV>[]) => {
    setListings(updatedListings);
    localStorage.setItem("rv_admin_listings", JSON.stringify(updatedListings));
  };

  const handleSave = (rv: Partial<RV>) => {
    if (!rv.title || !rv.brand || !rv.price) {
      toast.error("Title, brand, and price are required");
      return;
    }
    const existing = listings.findIndex((l) => l.id === rv.id);
    if (existing >= 0) {
      const updated = [...listings];
      updated[existing] = rv;
      save(updated);
      toast.success("RV updated");
    } else {
      rv.id = `rv-admin-${Date.now()}`;
      save([...listings, rv]);
      toast.success("RV added");
    }
    setEditingRV(null);
  };

  const handleDelete = (id: string) => {
    save(listings.filter((l) => l.id !== id));
    toast.success("RV deleted");
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
            <RVForm rv={editingRV} onSave={handleSave} onCancel={() => setEditingRV(null)} />
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{listings.length} custom listing(s) in admin. Listings in code: edit <code className="text-xs bg-muted px-1 py-0.5 rounded">src/data/mockData.ts</code></p>
              <Button onClick={() => setEditingRV({ ...emptyRV })}>
                <Plus className="h-4 w-4 mr-2" /> Add RV
              </Button>
            </div>

            <div className="space-y-3">
              {listings.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Upload className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No custom listings yet. Click "Add RV" to create one.</p>
                  <p className="text-xs mt-2">For bulk uploads (50+ RVs), edit <code className="bg-muted px-1 py-0.5 rounded">src/data/mockData.ts</code> directly or enable Lovable Cloud for a database.</p>
                </div>
              )}
              {listings.map((rv) => (
                <div key={rv.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                  {rv.images && rv.images[0] && (
                    <img src={rv.images[0]} alt={rv.title} className="h-16 w-24 rounded object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{rv.title}</p>
                    <p className="text-xs text-muted-foreground">{rv.type} · {rv.year} · ${rv.price?.toLocaleString()} · {rv.country}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setEditingRV({ ...rv })}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(rv.id!)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
