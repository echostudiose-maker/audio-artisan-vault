// Hotmart webhook handler
// Handles purchase events: activates subscription if user already exists,
// otherwise stores in pending_hotmart_purchases for activation on signup.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const APPROVED_EVENTS = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "SUBSCRIPTION_REACTIVATED",
]);

const CANCELLED_EVENTS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const expectedToken = Deno.env.get("HOTMART_HOTTOK");
    if (!expectedToken) {
      console.error("HOTMART_HOTTOK not configured");
      return json({ error: "Server misconfigured" }, 500);
    }

    // Hotmart sends the hottok either as header or in payload
    const headerToken =
      req.headers.get("x-hotmart-hottok") ?? req.headers.get("X-HOTMART-HOTTOK");

    const body = await req.json().catch(() => null);
    if (!body) return json({ error: "Invalid JSON" }, 400);

    const payloadToken = body?.hottok ?? body?.data?.hottok;
    const providedToken = headerToken ?? payloadToken;

    if (providedToken !== expectedToken) {
      console.warn("Invalid hottok");
      return json({ error: "Unauthorized" }, 401);
    }

    const event: string = body?.event ?? body?.data?.event ?? "";
    const buyerEmail: string | undefined =
      body?.data?.buyer?.email ?? body?.buyer?.email ?? body?.email;
    const transactionCode: string | undefined =
      body?.data?.purchase?.transaction ??
      body?.data?.purchase?.transaction_code ??
      body?.transaction;

    if (!buyerEmail) {
      return json({ error: "Missing buyer email" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const normalizedEmail = buyerEmail.toLowerCase().trim();

    // Find existing user by email
    const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error("listUsers error:", listErr);
      return json({ error: "Failed to lookup user" }, 500);
    }
    const existingUser = usersList?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail,
    );

    if (APPROVED_EVENTS.has(event)) {
      if (existingUser) {
        // Upsert active subscription for this user
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", existingUser.id)
          .maybeSingle();

        const subPayload = {
          user_id: existingUser.id,
          status: "active" as const,
          plan_type: "annual",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          stripe_subscription_id: transactionCode ?? null,
        };

        if (existingSub) {
          await supabase
            .from("subscriptions")
            .update(subPayload)
            .eq("id", existingSub.id);
        } else {
          await supabase.from("subscriptions").insert(subPayload);
        }

        return json({ success: true, action: "subscription_activated" });
      } else {
        // Store as pending — will be activated on signup via trigger
        await supabase
          .from("pending_hotmart_purchases")
          .upsert(
            {
              buyer_email: normalizedEmail,
              event,
              transaction_code: transactionCode ?? null,
              payload: body,
              processed: false,
            },
            { onConflict: "buyer_email" },
          );

        return json({ success: true, action: "pending_stored" });
      }
    }

    if (CANCELLED_EVENTS.has(event)) {
      if (existingUser) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", existingUser.id);
      } else {
        // Remove pending so they don't get activated later
        await supabase
          .from("pending_hotmart_purchases")
          .delete()
          .eq("buyer_email", normalizedEmail);
      }
      return json({ success: true, action: "subscription_cancelled" });
    }

    return json({ success: true, action: "ignored", event });
  } catch (err) {
    console.error("Webhook error:", err);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
