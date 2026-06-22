import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminUserRow = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  roles: ("admin" | "editor")[];
};

type AuthSupabase = SupabaseClient<Database>;

async function assertAdmin(supabase: AuthSupabase, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

type ListedUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: ("admin" | "editor")[] | null;
};

function mapListedUsers(rows: ListedUser[]): AdminUserRow[] {
  return rows.map((u) => ({
    id: u.id,
    email: u.email ?? null,
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at ?? null,
    roles: (u.roles ?? []).filter((r): r is "admin" | "editor" => r === "admin" || r === "editor"),
  }));
}

async function listUsersViaServiceRole(): Promise<AdminUserRow[]> {
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
}

function isMissingRpc(errorMessage: string, rpc: string) {
  const msg = errorMessage.toLowerCase();
  return msg.includes(rpc) && (msg.includes("does not exist") || msg.includes("could not find"));
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.supabase, context.userId);

    const { data, error } = await context.supabase.rpc("admin_list_users");
    if (!error) {
      return mapListedUsers((data ?? []) as ListedUser[]);
    }

    if (isMissingRpc(error.message, "admin_list_users")) {
      try {
        return await listUsersViaServiceRole();
      } catch (e) {
        throw new Error(
          `${(e as Error).message} — or run the Supabase migration admin_user_rpcs in the SQL editor.`,
        );
      }
    }

    throw new Error(error.message);
  });

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: "admin" | "editor" }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
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

    if (data.role === "admin") {
      const { data: admins, error } = await context.supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (error) throw new Error(error.message);
      if ((admins?.length ?? 0) <= 1) {
        throw new Error("Cannot remove the last remaining admin.");
      }
    }

    const { error } = await context.supabase
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

    const email = data.email.trim();
    if (!email) throw new Error("Email is required");

    const { data: userId, error: findErr } = await context.supabase.rpc("admin_find_user_by_email", {
      _email: email,
    });
    if (findErr) {
      if (isMissingRpc(findErr.message, "admin_find_user_by_email")) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const found = existing?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
        if (!found) {
          throw new Error("No account with that email yet. Ask them to sign up at /login, then grant the role here.");
        }
        const { error } = await context.supabase
          .from("user_roles")
          .upsert({ user_id: found, role: data.role }, { onConflict: "user_id,role" });
        if (error) throw new Error(error.message);
        return { ok: true, userId: found };
      }
      throw new Error(findErr.message);
    }
    if (!userId) {
      throw new Error("No account with that email yet. Ask them to sign up at /login, then grant the role here.");
    }

    const { error } = await context.supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true, userId };
  });
