import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Link as LinkIcon, Mail } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const url = window.location.href;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const links = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { label: "X / Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${text}&body=${encoded}` },
    { label: "SMS", icon: Share2, href: `sms:?body=${text}%20${encoded}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-card p-2 shadow-elevated z-10">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition"
            >
              <l.icon className="h-4 w-4 text-muted-foreground" /> {l.label}
            </a>
          ))}
          <button onClick={copyLink} className="w-full flex items-center gap-3 text-left rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition">
            <LinkIcon className="h-4 w-4 text-muted-foreground" /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
