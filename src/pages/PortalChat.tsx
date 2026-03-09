import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_type: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  rv_title: string | null;
  sales_pro: string | null;
}

const PortalChat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    // Load conversation
    supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single()
      .then(({ data }) => {
        if (data) setConversation(data);
      });

    // Load messages
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // Realtime
    const channel = supabase
      .channel(`chat-${conversationId}`)
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
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_type: "customer",
        content,
      });

      // Notify admin
      await supabase.functions.invoke("notify-email", {
        body: {
          type: "chat",
          data: {
            rv_title: conversation?.rv_title || "General",
            customer_email: user.email,
            message: content,
            sales_pro: conversation?.sales_pro,
          },
        },
      });
    } catch (err) {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/portal" className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-semibold text-foreground font-heading text-sm">
              {conversation?.sales_pro
                ? `Chatting with ${conversation.sales_pro}`
                : "Chat with Sales"}
            </p>
            {conversation?.rv_title && (
              <p className="text-xs text-muted-foreground">{conversation.rv_title}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="container py-4 space-y-2 max-w-2xl">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Start the conversation!
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm ${
                  msg.sender_type === "customer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border text-foreground"
                }`}
              >
                {msg.sender_type === "admin" && conversation?.sales_pro && (
                  <p className="text-xs font-bold mb-1 opacity-70">{conversation.sales_pro}</p>
                )}
                <p>{msg.content}</p>
                <p className="text-[10px] opacity-50 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card">
        <div className="container py-3 flex gap-2 max-w-2xl">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalChat;
