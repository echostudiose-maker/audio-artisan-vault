import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SITE_URL = "https://echomusic.online";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();

    const hottok = body.hottok;
    const expectedHottok = Deno.env.get("HOTMART_HOTTOK");

    if (!expectedHottok || hottok !== expectedHottok) {
      console.error("Invalid hottok");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const event = body.event;
    const data = body.data;

    if (!event || !data) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buyerEmail = data.buyer?.email?.toLowerCase();
    const buyerName = data.buyer?.name || "";
    const transactionCode = data.purchase?.transaction || data.purchase?.order_date;

    if (!buyerEmail) {
      return new Response(JSON.stringify({ error: "No buyer email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Find user by email — paginate through all users
    let foundUser = null;
    let page = 1;
    const perPage = 1000;

    while (!foundUser) {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({ page, perPage });
      if (userError || !users || users.length === 0) break;
      foundUser = users.find((u) => u.email?.toLowerCase() === buyerEmail) ?? null;
      if (users.length < perPage) break;
      page++;
    }

    switch (event) {
      case "PURCHASE_COMPLETE":
      case "PURCHASE_APPROVED": {

        if (!foundUser) {
          // ── Conta não existe → criar automaticamente ──
          const randomPassword = [...crypto.getRandomValues(new Uint8Array(20))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("") + "Aa1!";

          const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
            email: buyerEmail,
            password: randomPassword,
            email_confirm: true,
            user_metadata: { full_name: buyerName },
          });

          if (createError) {
            console.error("Error creating user:", createError);
            return new Response(JSON.stringify({ error: "Failed to create user account" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          foundUser = newUserData.user;
          console.log(`Auto-created account for ${buyerEmail}`);

          // Criar subscription
          await supabase.from("subscriptions").insert({
            user_id: foundUser.id,
            status: "active",
            plan_type: "lifetime",
            current_period_start: now.toISOString(),
            current_period_end: oneYearLater.toISOString(),
            stripe_customer_id: buyerEmail,
            stripe_subscription_id: transactionCode,
          });

          // Enviar email para a pessoa definir a senha
          await supabase.auth.admin.generateLink({
            type: "recovery",
            email: buyerEmail,
            options: {
              redirectTo: `${SITE_URL}/auth?mode=reset`,
            },
          });

          console.log(`Password setup email sent to ${buyerEmail}`);

        } else {
          // ── Conta já existe → atualizar subscription ──
          const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", foundUser.id)
            .single();

          if (existingSub) {
            await supabase.from("subscriptions").update({
              status: "active",
              plan_type: "lifetime",
              current_period_start: now.toISOString(),
              current_period_end: oneYearLater.toISOString(),
              stripe_customer_id: buyerEmail,
              stripe_subscription_id: transactionCode,
              updated_at: now.toISOString(),
            }).eq("user_id", foundUser.id);
          } else {
            await supabase.from("subscriptions").insert({
              user_id: foundUser.id,
              status: "active",
              plan_type: "lifetime",
              current_period_start: now.toISOString(),
              current_period_end: oneYearLater.toISOString(),
              stripe_customer_id: buyerEmail,
              stripe_subscription_id: transactionCode,
            });
          }

          console.log(`Subscription updated for existing user ${foundUser.id}`);
        }

        break;
      }

      case "PURCHASE_CANCELED":
      case "PURCHASE_REFUNDED":
      case "PURCHASE_CHARGEBACK": {
        if (foundUser) {
          await supabase.from("subscriptions").update({
            status: "cancelled",
            updated_at: now.toISOString(),
          }).eq("user_id", foundUser.id);
          console.log(`Subscription cancelled for ${buyerEmail}`);
        }
        break;
      }

      case "PURCHASE_DELAYED":
      case "PURCHASE_PROTEST": {
        if (foundUser) {
          await supabase.from("subscriptions").update({
            status: "pending",
            updated_at: now.toISOString(),
          }).eq("user_id", foundUser.id);
          console.log(`Subscription set to pending for ${buyerEmail}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return new Response(
      JSON.stringify({ status: "ok", event, email: buyerEmail }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
