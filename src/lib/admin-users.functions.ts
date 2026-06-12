import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminUserRow = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  roles: ("admin" | "editor")[];
};

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rolesData, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rolesErr) throw new Error(rolesErr.message);

    const { data: usersData, error: usersErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (usersErr) throw new Error(usersErr.message);

    const rolesByUser = new Map<string, ("admin" | "editor")[]>();
    for (const r of rolesData ?? []) {
      if (r.role === "admin" || r.role === "editor") {
        const list = rolesByUser.get(r.user_id) ?? [];
        list.push(r.role);
        rolesByUser.set(r.user_id, list);
      }
    }

    return (usersData.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      roles: rolesByUser.get(u.id) ?? [],
    }));
  });

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: "admin" | "editor" }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: "admin" | "editor" }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    // Prevent removing the last admin
    if (data.role === "admin") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: admins, error } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (error) throw new Error(error.message);
      if ((admins?.length ?? 0) <= 1) {
        throw new Error("Cannot remove the last remaining admin.");
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const inviteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; role: "admin" | "editor" }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find or create the user
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = existing?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase())?.id;

    if (!userId) {
      const { data: invited, error: invErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
      if (invErr) {
        // Fallback: create the user without email if invite isn't configured
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          email_confirm: false,
        });
        if (createErr) throw new Error(createErr.message);
        userId = created.user?.id;
      } else {
        userId = invited.user?.id;
      }
    }

    if (!userId) throw new Error("Could not create or find user");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true, userId };
  });
