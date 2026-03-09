import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ChatWidgetProps {
  rvId?: string;
  rvTitle?: string;
  salesPro?: string;
}

interface Message {
  id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

export function ChatWidget({ rvId, rvTitle, salesPro }: ChatWidgetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find or create conversation
  useEffect(() => {
    if (!user || !open) return;

    const findOrCreateConversation = async () => {
      // Try to find existing conversation for this RV
      let query = supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id);

      if (rvId) {
        query = query.eq("rv_id", rvId);
      }

      const { data } = await query.order("created_at", { ascending: false }).limit(1);

      if (data && data.length > 0) {
        setConversationId(data[0].id);
      } else {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            rv_id: rvId || null,
            rv_title: rvTitle || null,
            sales_pro: salesPro || null,
          })
          .select()
          .single();

        if (!error && newConv) {
          setConversationId(newConv.id);
        }
      }
    };

    findOrCreateConversation();
  }, [user, open, rvId]);

  // Load messages
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !user) return;
    setLoading(true);

    const content = input.trim();
    setInput("");

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_type: "customer",
        content,
      });

      if (error) throw error;

      // Notify admin via edge function
      await supabase.functions.invoke("notify-email", {
        body: {
          type: "chat",
          data: {
            rv_title: rvTitle || "General",
            customer_email: user.email,
            message: content,
            sales_pro: salesPro,
          },
        },
      });
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Chat only available for logged-in users
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero shadow-elevated text-primary-foreground hover:scale-105 transition-transform"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl border bg-card shadow-elevated overflow-hidden flex flex-col" style={{ height: "28rem" }}>
      {/* Header */}
      <div className="bg-gradient-hero p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-primary-foreground font-heading">
            {salesPro ? `Chatting with ${salesPro}` : "Chat with Sales"}
          </p>
          {rvTitle && <p className="text-xs text-primary-foreground/70">{rvTitle}</p>}
        </div>
        <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Start the conversation! Ask about payment methods, financing, or anything else.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                msg.sender_type === "customer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.sender_type === "admin" && salesPro && (
                <p className="text-xs font-semibold mb-0.5 opacity-70">{salesPro}</p>
              )}
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
