import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FORWARD_TO = "americancommunitygrantprograms@usa.com";
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Raw inbound payload keys:", JSON.stringify(Object.keys(payload)));

    // Resend wraps inbound email data inside a "data" property
    const emailData = payload.data || payload;
    console.log("Email data keys:", JSON.stringify(Object.keys(emailData)));

    // Extract fields - handle both string and object "from" formats
    let from = "";
    if (typeof emailData.from === "string") {
      from = emailData.from;
    } else if (emailData.from && typeof emailData.from === "object") {
      // Resend may send { name: "...", address: "..." }
      const name = emailData.from.name || "";
      const address = emailData.from.address || emailData.from.email || "";
      from = name ? `${name} <${address}>` : address;
    }

    const subject = emailData.subject || "";
    const html = emailData.html || "";
    const text = emailData.text || "";
    const inboundAttachments = emailData.attachments || [];

    console.log("Parsed from:", from);
    console.log("Parsed subject:", subject);
    console.log("Has html:", !!html, "Has text:", !!text);
    console.log("Attachments count:", Array.isArray(inboundAttachments) ? inboundAttachments.length : 0);

    // Safety: skip if from contains onresend.com or notifications@
    const fromAddress = (from || "").toLowerCase();
    if (fromAddress.includes("onresend.com") || fromAddress.includes("notifications@")) {
      console.log("Skipping email from:", fromAddress);
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process attachments
    const resendAttachments: Array<{ filename: string; content: string }> = [];
    const attachmentLinks: string[] = [];
    const dbAttachments: Array<{ filename: string; url: string; size: number }> = [];

    if (Array.isArray(inboundAttachments)) {
      for (const att of inboundAttachments) {
        const filename = att.filename || att.name || "attachment";
        const size = att.size || 0;
        const url = att.url || att.content_url || "";
        const base64Content = att.content || "";

        // Save attachment info for DB
        if (url || base64Content) {
          dbAttachments.push({ filename, url: url || "(inline)", size });
        }

        // If we have base64 content directly from Resend, use it
        if (base64Content) {
          if (size <= MAX_ATTACHMENT_SIZE) {
            resendAttachments.push({ filename, content: base64Content });
          } else {
            attachmentLinks.push(
              `<p>📎 <strong>${filename}</strong> (too large - ${Math.round(size / 1024 / 1024)}MB)</p>`
            );
          }
          continue;
        }

        if (size > MAX_ATTACHMENT_SIZE) {
          attachmentLinks.push(
            `<p>📎 <strong>${filename}</strong> (too large to attach - ${Math.round(size / 1024 / 1024)}MB): <a href="${url}">Download Attachment</a></p>`
          );
          continue;
        }

        if (url) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              resendAttachments.push({ filename, content: base64 });
            } else {
              attachmentLinks.push(
                `<p>📎 <strong>${filename}</strong>: <a href="${url}">Download Attachment</a></p>`
              );
            }
          } catch {
            attachmentLinks.push(
              `<p>📎 <strong>${filename}</strong>: <a href="${url}">Download Attachment</a></p>`
            );
          }
        }
      }
    }

    const attachmentSection = attachmentLinks.length > 0
      ? `<hr/><h3>Attachments (Download Links)</h3>${attachmentLinks.join("")}`
      : "";

    const bodyContent = html || text || "(empty body)";
    const subjectLine = subject || "(no subject)";

    const emailHtml = `
      <h2>Forwarded Email from sales@rvmarket.org</h2>
      <p><strong>From:</strong> ${from || "Unknown sender"}</p>
      <p><strong>Subject:</strong> ${subjectLine}</p>
      <hr/>
      <div>${bodyContent}</div>
      ${attachmentSection}
    `;

    const emailPayload: Record<string, any> = {
      from: "RV Market System <sales@rvmarket.org>",
      to: FORWARD_TO,
      subject: `[FWD] ${subjectLine} — from ${from || "Unknown"}`,
      html: emailHtml,
    };

    if (resendAttachments.length > 0) {
      emailPayload.attachments = resendAttachments;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Resend error:", result);
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(result)}`);
    }

    console.log("Email forwarded successfully:", result);

    // Extract sender name and email from the "from" field
    const fromMatch = (from || "").match(/^(.+?)\s*<(.+?)>$/);
    const senderName = fromMatch ? fromMatch[1].trim() : (from || "Unknown");
    const senderEmail = fromMatch ? fromMatch[2].trim() : (from || "unknown@unknown.com");

    // Save to inquiries table so it shows in admin dashboard
    await supabase.from("inquiries").insert({
      name: senderName,
      email: senderEmail,
      message: text || html || "(empty body)",
      original_subject: subject || null,
      resend_message_id: result.id || null,
      rv_title: null,
      rv_id: null,
      status: "new",
      attachments: dbAttachments.length > 0 ? dbAttachments : [],
    });

    console.log("Inbound email saved to inquiries table");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
