import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: "Assinatura Premium necessária" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (
      subscription.current_period_end &&
      new Date(subscription.current_period_end) < new Date()
    ) {
      return new Response(
        JSON.stringify({ error: "Assinatura expirada" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get file info from request
    const { fileUrl, type, itemId, title } = await req.json();

    if (!fileUrl || !type || !itemId) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract bucket and path from the public URL
    // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split("/storage/v1/object/public/");
    if (pathParts.length < 2) {
      return new Response(
        JSON.stringify({ error: "URL de arquivo inválida" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const storagePath = pathParts[1];
    const bucketEnd = storagePath.indexOf("/");
    const bucket = storagePath.substring(0, bucketEnd);
    const filePath = storagePath.substring(bucketEnd + 1);

    // Use service role to generate signed URL
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filePath, 300); // 5 minutes expiry

    if (signedUrlError || !signedUrlData) {
      return new Response(
        JSON.stringify({ error: "Erro ao gerar link de download" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Record download
    const downloadRecord: Record<string, string> = { user_id: user.id };
    if (type === "music") {
      downloadRecord.track_id = itemId;
    } else {
      downloadRecord.sfx_id = itemId;
    }

    await supabaseAdmin.from("downloads").insert(downloadRecord);

    // Increment download count
    const table = type === "music" ? "music_tracks" : "sound_effects";
    const { data: currentItem } = await supabaseAdmin
      .from(table)
      .select("download_count")
      .eq("id", itemId)
      .single();

    if (currentItem) {
      await supabaseAdmin
        .from(table)
        .update({ download_count: (currentItem.download_count || 0) + 1 })
        .eq("id", itemId);
    }

    return new Response(
      JSON.stringify({ url: signedUrlData.signedUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
