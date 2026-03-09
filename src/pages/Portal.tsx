import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, CreditCard, LogOut, Trash2, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  rv_id: string;
  rv_listings: {
    id: string;
    title: string;
    price: number;
    images: string[] | null;
    brand: string;
    year: number;
    location: string | null;
  };
}

interface Transaction {
  id: string;
  rv_title: string;
  rv_price: number;
  amount_paid: number;
  payment_method: string | null;
  status: string;
  crypto_address: string | null;
  crypto_qr_url: string | null;
  created_at: string;
  notes: string | null;
}

interface Conversation {
  id: string;
  rv_title: string | null;
  sales_pro: string | null;
  updated_at: string;
}

const Portal = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState("wishlist");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      // Load wishlist
      const { data: wl } = await supabase
        .from("wishlists")
        .select("id, rv_id, rv_listings(id, title, price, images, brand, year, location)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (wl) setWishlist(wl as any);

      // Load transactions
      const { data: tx } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (tx) setTransactions(tx);

      // Load conversations
      const { data: convs } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (convs) setConversations(convs);
    };

    loadData();
  }, [user]);

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase.from("wishlists").delete().eq("id", id);
    if (!error) {
      setWishlist((prev) => prev.filter((w) => w.id !== id));
      toast.success("Removed from saved RVs");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold font-heading text-foreground">My Portal</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="wishlist" className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" /> Saved RVs
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> Messages
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Payments
            </TabsTrigger>
          </TabsList>

          {/* Wishlist */}
          <TabsContent value="wishlist">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No saved RVs yet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/inventory">Browse Inventory</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 rounded-lg border bg-card p-4"
                  >
                    {item.rv_listings?.images?.[0] && (
                      <img
                        src={item.rv_listings.images[0]}
                        alt={item.rv_listings.title}
                        className="h-16 w-24 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.rv_listings?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.rv_listings?.brand} · {item.rv_listings?.year} · {format(item.rv_listings?.price || 0)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/rv/${item.rv_id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            {conversations.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations yet. Start a chat from any RV listing.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`/portal/chat/${conv.id}`}
                    className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {conv.rv_title || "General Inquiry"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conv.sales_pro && `Chatting with ${conv.sales_pro} · `}
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments">
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="rounded-lg border bg-card p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{tx.rv_title || "RV Purchase"}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.payment_method && `${tx.payment_method} · `}
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          tx.status === "completed"
                            ? "bg-primary/10 text-primary"
                            : tx.status === "partial"
                            ? "bg-secondary/10 text-secondary"
                            : tx.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center rounded-lg bg-muted p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Price</p>
                        <p className="font-bold text-foreground">{format(tx.rv_price)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-bold text-primary">{format(tx.amount_paid)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="font-bold text-destructive">{format(tx.rv_price - tx.amount_paid)}</p>
                      </div>
                    </div>

                    {tx.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">{tx.notes}</p>
                    )}

                    {/* Crypto details */}
                    {tx.payment_method === "Cryptocurrency" && tx.crypto_address && (
                      <div className="rounded-lg border p-4 space-y-3">
                        <p className="text-sm font-semibold text-foreground">Crypto Payment Details</p>
                        {tx.crypto_qr_url && (
                          <div className="flex justify-center">
                            <img src={tx.crypto_qr_url} alt="Crypto QR Code" className="h-40 w-40 rounded" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-muted p-2 rounded break-all">{tx.crypto_address}</code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(tx.crypto_address!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portal;
