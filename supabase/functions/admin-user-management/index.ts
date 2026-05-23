import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_ROLES = ["super_admin", "event_manager", "content_manager", "support"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface Payload {
  action: string;
  user_id?: string;
  email?: string;
  name?: string;
  rolle?: string;
  password?: string;
  redirect_to?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return respond({ error: "Missing authorization" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return respond({ error: "Invalid session" }, 401);
    }
    const callerId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: caller, error: callerErr } = await admin
      .from("admin_users")
      .select("id, rolle")
      .eq("id", callerId)
      .maybeSingle();

    if (callerErr || !caller || caller.rolle !== "super_admin") {
      return respond({ error: "Forbidden" }, 403);
    }

    let payload: Payload;
    try {
      payload = await req.json();
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }

    const action = payload.action;

    if (action === "create_user") {
      const email = (payload.email ?? "").trim().toLowerCase();
      const name = (payload.name ?? "").trim().slice(0, 120);
      const rolle = payload.rolle ?? "";
      const password = payload.password ?? "";

      if (!EMAIL_RE.test(email)) return respond({ error: "Invalid email" }, 400);
      if (!ALLOWED_ROLES.includes(rolle)) return respond({ error: "Invalid role" }, 400);
      if (password.length < 10) return respond({ error: "Password must be at least 10 characters" }, 400);

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr || !created?.user) {
        return respond({ error: createErr?.message ?? "Create failed" }, 400);
      }

      const newId = created.user.id;
      const { error: insertErr } = await admin
        .from("admin_users")
        .insert({ id: newId, email, name, rolle });
      if (insertErr) {
        await admin.auth.admin.deleteUser(newId);
        return respond({ error: insertErr.message }, 400);
      }
      return respond({ success: true, id: newId }, 200);
    }

    if (action === "update_role") {
      const target = payload.user_id;
      const rolle = payload.rolle ?? "";
      const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : undefined;
      if (!target) return respond({ error: "Missing user_id" }, 400);
      if (!ALLOWED_ROLES.includes(rolle)) return respond({ error: "Invalid role" }, 400);

      if (target === callerId && rolle !== "super_admin") {
        return respond({ error: "Cannot demote yourself" }, 400);
      }

      if (rolle !== "super_admin") {
        const { count } = await admin
          .from("admin_users")
          .select("*", { count: "exact", head: true })
          .eq("rolle", "super_admin");
        const { data: current } = await admin
          .from("admin_users")
          .select("rolle")
          .eq("id", target)
          .maybeSingle();
        if (current?.rolle === "super_admin" && (count ?? 0) <= 1) {
          return respond({ error: "At least one super_admin is required" }, 400);
        }
      }

      const update: Record<string, unknown> = { rolle };
      if (name !== undefined) update.name = name;
      const { error: updErr } = await admin.from("admin_users").update(update).eq("id", target);
      if (updErr) return respond({ error: updErr.message }, 400);
      return respond({ success: true }, 200);
    }

    if (action === "delete_user") {
      const target = payload.user_id;
      if (!target) return respond({ error: "Missing user_id" }, 400);
      if (target === callerId) return respond({ error: "Cannot delete yourself" }, 400);

      const { data: current } = await admin
        .from("admin_users")
        .select("rolle")
        .eq("id", target)
        .maybeSingle();
      if (current?.rolle === "super_admin") {
        const { count } = await admin
          .from("admin_users")
          .select("*", { count: "exact", head: true })
          .eq("rolle", "super_admin");
        if ((count ?? 0) <= 1) {
          return respond({ error: "At least one super_admin is required" }, 400);
        }
      }

      const { error: delRowErr } = await admin.from("admin_users").delete().eq("id", target);
      if (delRowErr) return respond({ error: delRowErr.message }, 400);
      const { error: delAuthErr } = await admin.auth.admin.deleteUser(target);
      if (delAuthErr) return respond({ error: delAuthErr.message }, 400);
      return respond({ success: true }, 200);
    }

    if (action === "reset_password") {
      const target = payload.user_id;
      const redirectTo = typeof payload.redirect_to === "string" ? payload.redirect_to : undefined;
      if (!target) return respond({ error: "Missing user_id" }, 400);

      const { data: row } = await admin
        .from("admin_users")
        .select("email")
        .eq("id", target)
        .maybeSingle();
      if (!row?.email) return respond({ error: "User not found" }, 404);

      const { error: linkErr } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: row.email,
        options: redirectTo ? { redirectTo } : undefined,
      });
      if (linkErr) return respond({ error: linkErr.message }, 400);
      return respond({ success: true }, 200);
    }

    if (action === "set_password") {
      const target = payload.user_id;
      const password = payload.password ?? "";
      if (!target) return respond({ error: "Missing user_id" }, 400);
      if (password.length < 10) return respond({ error: "Password must be at least 10 characters" }, 400);

      const { error: updErr } = await admin.auth.admin.updateUserById(target, { password });
      if (updErr) return respond({ error: updErr.message }, 400);
      return respond({ success: true }, 200);
    }

    return respond({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("admin-user-management error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
