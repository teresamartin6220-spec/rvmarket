import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, X, Image, BarChart3, Copy, MessageCircle, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RV_TYPES } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import type { DBListing } from "@/hooks/useListings";

const ADMIN_PASS = "rvmarket2024";

const SALES_PROS = ["TERESA MARTIN", "JOHNNY WOOL", "THOMAS WALKER", "SHERRY ROSS", "JANET WHITE", "SAM GILLS"];

const SPEC_FIELDS = [
  { key: "sleepingCapacity", label: "Sleeping Capacity", placeholder: "e.g. 6" },
  { key: "generator", label: "Generator", placeholder: "e.g. 4KW Onan Microlite" },
  { key: "fuelTankCapacity", label: "Fuel Tank Capacity", placeholder: "e.g. 55 gal." },
  { key: "freshWaterCapacity", label: "Fresh Water Capacity", placeholder: "e.g. 40 gal." },
  { key: "lpgCapacity", label: "LPG Capacity", placeholder: "e.g. 12.2 gal." },
  { key: "greyTankCapacity", label: "Grey Tank Capacity", placeholder: "e.g. 22 gal." },
  { key: "blackTankCapacity", label: "Black Tank Capacity", placeholder: "e.g. 25 gal." },
  { key: "hotWaterCapacity", label: "Hot Water Capacity", placeholder: "e.g. 6 gal." },
  { key: "gvwr", label: "GVWR", placeholder: "e.g. 12,500 lbs." },
  { key: "exteriorLength", label: "Exterior Length", placeholder: "e.g. 25 ft." },
  { key: "exteriorHeight", label: "Exterior Height", placeholder: "e.g. 10.7 ft." },
  { key: "exteriorWidth", label: "Exterior Width", placeholder: "e.g. 8.3 ft." },
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
  description: "", location: "", country: "USA", images: [], is_sold: false, is_super_special: false, sales_pro: null,
  specs: {}, features: {},
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
      if (newImages.length >= 20) break;
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
          <div><Label>Location</Label><Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Denver, CO" /></div>
          <div>
            <Label>Country</Label>
            <Select value={form.country || "USA"} onValueChange={(v) => update("country", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["USA", "Canada", "UK", "Australia"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Sales Pro</Label>
            <Select value={form.sales_pro || "none"} onValueChange={(v) => update("sales_pro", v === "none" ? null : v)}>
              <SelectTrigger><SelectValue placeholder="Select Sales Pro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {SALES_PROS.map((sp) => <SelectItem key={sp} value={sp}>{sp}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-4">
            <Label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_sold || false} onChange={(e) => update("is_sold", e.target.checked)} className="rounded" />
              Mark as Sold
            </Label>
            <Label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_super_special || false} onChange={(e) => update("is_super_special", e.target.checked)} className="rounded accent-amber-500" />
              ⭐ Super Special
            </Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Description</h3>
        <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={5} placeholder="Full RV description..." />
      </div>

      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Images (up to 20)</h3>
        <div className="flex gap-2 mt-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1" />
          <Button type="button" variant="outline" onClick={addImage} disabled={(form.images?.length || 0) >= 20}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
            <Image className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload from device"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading || (form.images?.length || 0) >= 20} />
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

      <div>
        <h3 className="font-heading font-semibold text-foreground mb-3">Specifications</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPEC_FIELDS.map(({ key, label, placeholder }) => (
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
      </div>

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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
];

// ===== Admin Chat Component =====
interface AdminConversation {
  id: string;
  user_id: string;
  rv_title: string | null;
  sales_pro: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminMessage {
  id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

function AdminChat() {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();

    const channel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        if (selectedConv) loadMessages(selectedConv);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" }, () => {
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedConv]);

  const loadConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const selectConversation = (convId: string) => {
    setSelectedConv(convId);
    loadMessages(convId);
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedConv) return;
    setLoading(true);
    const content = reply.trim();
    setReply("");

    await supabase.from("messages").insert({
      conversation_id: selectedConv,
      sender_type: "admin",
      content,
    });

    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", selectedConv);

    loadMessages(selectedConv);
    setLoading(false);
  };

  const conv = conversations.find((c) => c.id === selectedConv);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 min-h-[500px]">
      {/* Conversation list */}
      <div className="rounded-lg border bg-card overflow-y-auto max-h-[600px]">
        <div className="p-3 border-b">
          <p className="font-semibold text-foreground text-sm">{conversations.length} Conversation(s)</p>
        </div>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => selectConversation(c.id)}
            className={`w-full text-left p-3 border-b hover:bg-muted/50 transition ${
              selectedConv === c.id ? "bg-muted" : ""
            }`}
          >
            <p className="text-sm font-medium text-foreground truncate">{c.rv_title || "General Inquiry"}</p>
            <p className="text-xs text-muted-foreground">
              {c.sales_pro && `${c.sales_pro} · `}
              {new Date(c.updated_at).toLocaleDateString()}
            </p>
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground text-center">No conversations yet</p>
        )}
      </div>

      {/* Chat area */}
      <div className="rounded-lg border bg-card flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-3 border-b">
              <p className="font-semibold text-foreground text-sm">{conv?.rv_title || "General Inquiry"}</p>
              {conv?.sales_pro && <p className="text-xs text-muted-foreground">Sales Pro: {conv.sales_pro}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[400px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender_type === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}>
                    <p className="text-xs font-bold mb-0.5 opacity-70">
                      {msg.sender_type === "admin" ? (conv?.sales_pro || "Admin") : "Customer"}
                    </p>
                    {msg.content}
                    <p className="text-[10px] opacity-50 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type reply..."
                className="flex-1"
              />
              <Button onClick={sendReply} disabled={loading || !reply.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a conversation to respond
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Admin Transactions Component =====
interface Transaction {
  id: string;
  user_id: string;
  rv_id: string | null;
  rv_title: string | null;
  rv_price: number;
  amount_paid: number;
  payment_method: string | null;
  status: string;
  notes: string | null;
  crypto_address: string | null;
  crypto_qr_url: string | null;
  created_at: string;
}

function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTx, setEditingTx] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editCryptoAddr, setEditCryptoAddr] = useState("");
  const [cryptoQrUploading, setCryptoQrUploading] = useState(false);
  const [editCryptoQr, setEditCryptoQr] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
  };

  const startEdit = (tx: Transaction) => {
    setEditingTx(tx.id);
    setEditAmount(String(tx.amount_paid));
    setEditStatus(tx.status);
    setEditNotes(tx.notes || "");
    setEditCryptoAddr(tx.crypto_address || "");
    setEditCryptoQr(tx.crypto_qr_url || "");
  };

  const handleCryptoQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCryptoQrUploading(true);
    const fileName = `crypto-qr-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("rv-images").upload(fileName, file);
    if (error) {
      toast.error("Failed to upload QR code");
      setCryptoQrUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("rv-images").getPublicUrl(data.path);
    setEditCryptoQr(urlData.publicUrl);
    setCryptoQrUploading(false);
    toast.success("QR code uploaded!");
  };

  const saveEdit = async () => {
    if (!editingTx) return;
    const { error } = await supabase
      .from("transactions")
      .update({
        amount_paid: Number(editAmount),
        status: editStatus,
        notes: editNotes || null,
        crypto_address: editCryptoAddr || null,
        crypto_qr_url: editCryptoQr || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingTx);

    if (error) {
      toast.error("Failed to update");
      return;
    }
    toast.success("Transaction updated");
    setEditingTx(null);
    loadTransactions();
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{transactions.length} transaction(s)</p>
      {transactions.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No transactions yet</p>
      )}
      {transactions.map((tx) => (
        <div key={tx.id} className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-foreground">{tx.rv_title || "RV Purchase"}</p>
              <p className="text-sm text-muted-foreground">
                {tx.payment_method || "N/A"} · {new Date(tx.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                tx.status === "completed" ? "bg-primary/10 text-primary"
                : tx.status === "partial" ? "bg-secondary/10 text-secondary"
                : tx.status === "cancelled" ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
              }`}>
                {tx.status.toUpperCase()}
              </span>
              <Button variant="outline" size="sm" onClick={() => startEdit(tx)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center rounded-lg bg-muted p-3">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold text-foreground">${tx.rv_price.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="font-bold text-primary">${tx.amount_paid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="font-bold text-destructive">${(tx.rv_price - tx.amount_paid).toLocaleString()}</p>
            </div>
          </div>

          {editingTx === tx.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 border rounded-lg p-4">
              <h4 className="font-heading font-semibold text-foreground">Edit Transaction</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Amount Paid ($)</Label>
                  <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
              </div>

              {tx.payment_method === "Cryptocurrency" && (
                <div className="space-y-3 border-t pt-3">
                  <h5 className="text-sm font-semibold text-foreground">Crypto Payment Details</h5>
                  <div>
                    <Label>Crypto Address</Label>
                    <Input value={editCryptoAddr} onChange={(e) => setEditCryptoAddr(e.target.value)} placeholder="Enter wallet address..." />
                  </div>
                  <div>
                    <Label>QR Code</Label>
                    <div className="flex items-center gap-3 mt-1">
                      {editCryptoQr && <img src={editCryptoQr} alt="QR" className="h-20 w-20 rounded border" />}
                      <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
                        <Image className="h-4 w-4" />
                        {cryptoQrUploading ? "Uploading..." : "Upload QR Code"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleCryptoQrUpload} disabled={cryptoQrUploading} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={saveEdit}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingTx(null)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== Main Admin Component =====
const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [editingRV, setEditingRV] = useState<Partial<DBListing> | null>(null);
  const [listings, setListings] = useState<DBListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rv_listings").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load listings"); console.error(error); }
    else setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchListings(); }, [authed]);

  const sortedListings = [...listings].sort((a, b) => {
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
            <TabsTrigger value="chat" className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> Chat
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Transactions
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
                 <div className="flex items-center justify-between mb-6">
                   <p className="text-muted-foreground">{listings.length} listing(s) in database</p>
                   <div className="flex items-center gap-3">
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
                          </p>
                          <p className="text-xs text-muted-foreground">{rv.type} · {rv.year} · ${rv.price?.toLocaleString()} · {rv.country}</p>
                          <p className="text-xs text-muted-foreground">{rv.location && `📍 ${rv.location}`}{rv.vin && ` · VIN: ${rv.vin}`}{rv.stock_number && ` · Stock #${rv.stock_number}`}{rv.sales_pro && ` · 🧑‍💼 ${rv.sales_pro}`}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
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

          <TabsContent value="chat">
            <AdminChat />
          </TabsContent>

          <TabsContent value="transactions">
            <AdminTransactions />
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
