import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const NOTIFY_EMAIL = "info@rvmarket.com";

    let subject = "";
    let body = "";

    if (type === "inquiry") {
      subject = `New Inquiry: ${data.rv_title || "General"}`;
      body = `
New inquiry received!

RV: ${data.rv_title || "N/A"}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}

Message:
${data.message || "No message"}
      `.trim();
    } else if (type === "financing") {
      subject = `New Financing Application: ${data.rv_title || "General"}`;
      body = `
New financing application received!

RV: ${data.rv_title || "N/A"}
RV Price: $${data.rv_price?.toLocaleString() || "N/A"}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Down Payment: $${data.down_payment?.toLocaleString() || "0"}
Loan Term: ${data.loan_term || 60} months
Est. Monthly: $${data.estimated_monthly?.toLocaleString() || "N/A"}
      `.trim();
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the notification (in production, integrate with an email service)
    console.log(`📧 EMAIL NOTIFICATION`);
    console.log(`To: ${NOTIFY_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    return new Response(JSON.stringify({ success: true, message: "Notification logged" }), {
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
