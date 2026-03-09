import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { type, data } = await req.json();
    const NOTIFY_EMAIL = "rvmarketused@gmail.com";

    let subject = "";
    let html = "";

    if (type === "inquiry") {
      subject = `New Inquiry: ${data.rv_title || "General"}`;
      html = `
        <h2>New Inquiry Received</h2>
        <p><strong>RV:</strong> ${data.rv_title || "N/A"}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <h3>Message:</h3>
        <p>${data.message || "No message"}</p>
      `;
    } else if (type === "financing") {
      subject = `New Financing Application: ${data.rv_title || "General"}`;
      html = `
        <h2>New Financing Application</h2>
        <p><strong>RV:</strong> ${data.rv_title || "N/A"}</p>
        <p><strong>RV Price:</strong> $${data.rv_price?.toLocaleString() || "N/A"}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Down Payment:</strong> $${data.down_payment?.toLocaleString() || "0"}</p>
        <p><strong>Loan Term:</strong> ${data.loan_term || 60} months</p>
        <p><strong>Est. Monthly:</strong> $${data.estimated_monthly?.toLocaleString() || "N/A"}</p>
      `;
    } else if (type === "chat") {
      subject = `💬 New Chat Message: ${data.rv_title || "General"}`;
      html = `
        <h2>New Chat Message</h2>
        <p><strong>RV:</strong> ${data.rv_title || "N/A"}</p>
        <p><strong>Sales Pro:</strong> ${data.sales_pro || "Unassigned"}</p>
        <p><strong>Customer Email:</strong> ${data.customer_email || "N/A"}</p>
        <h3>Message:</h3>
        <p>${data.message || "No message"}</p>
        <hr/>
        <p><em>Reply from your admin panel at /admin</em></p>
      `;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: NOTIFY_EMAIL,
        subject,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(result)}`);
    }

    console.log("Email sent successfully:", result);

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
