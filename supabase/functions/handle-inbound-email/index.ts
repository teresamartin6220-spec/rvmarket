import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FORWARD_TO = "rvmarketused@gmail.com";
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

    const payload = await req.json();
    const { from, subject, html, text, attachments: inboundAttachments } = payload;

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

    if (Array.isArray(inboundAttachments)) {
      for (const att of inboundAttachments) {
        const url = att.url || att.content_url;
        const filename = att.filename || att.name || "attachment";
        const size = att.size || 0;

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

    const emailHtml = `
      <h2>Forwarded Email from sales@rvmarket.org</h2>
      <p><strong>From:</strong> ${from}</p>
      <p><strong>Subject:</strong> ${subject || "(no subject)"}</p>
      <hr/>
      <div>${html || text || "(empty body)"}</div>
      ${attachmentSection}
    `;

    const emailPayload: Record<string, any> = {
      from: "RV Market System <sales@rvmarket.org>",
      to: FORWARD_TO,
      subject: `[FWD] ${subject || "No Subject"} — from ${from}`,
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
