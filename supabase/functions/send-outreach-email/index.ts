const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const { to, subject, body, attachments } = await req.json();

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, body" }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    
        <tr><td style="padding:32px;">
          <div style="font-size:15px;line-height:1.7;color:#333333;">${body.replace(/\n/g, '<br>')}</div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
          <p style="font-size:13px;color:#666;">Best regards,<br><strong>RV Market Sales Team</strong></p>
          <p style="font-size:12px;color:#999;margin-top:16px;">
            📧 sales@rvmarket.org<br>
            🌐 <a href="https://rvmarket.org" style="color:#1a3a5c;">rvmarket.org</a>
          </p>
        </td></tr>
        
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const emailPayload: Record<string, unknown> = {
      from: "RV Market <sales@rvmarket.org>",
      to: [to],
      subject,
      html,
    };

    // Add attachments if provided
    if (Array.isArray(attachments) && attachments.length > 0) {
      emailPayload.attachments = attachments;
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
      return new Response(JSON.stringify({ error: `Resend API error: ${JSON.stringify(result)}` }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
