import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import {
  listAdminUsers,
  grantRole,
  revokeRole,
  inviteAdminUser,
  type AdminUserRow,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/users")({ component: UsersAdmin });

function UsersAdmin() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const list = useServerFn(listAdminUsers);
  const grant = useServerFn(grantRole);
  const revoke = useServerFn(revokeRole);
  const invite = useServerFn(inviteAdminUser);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => list(),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const grantMut = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "editor" }) => grant({ data: v }),
    onSuccess: () => { toast.success("Role granted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const revokeMut = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "editor" }) => revoke({ data: v }),
    onSuccess: () => { toast.success("Role removed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const inviteMut = useMutation({
    mutationFn: (v: { email: string; role: "admin" | "editor" }) => invite({ data: v }),
    onSuccess: () => { toast.success("User invited"); invalidate(); setEmail(""); },
    onError: (e: Error) => toast.error(e.message),
  });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("admin");

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Users</h1>
      <p className="text-sm text-muted-foreground">
        Invite teammates and manage their roles. Admins have full access; editors can edit content but cannot manage users.
      </p>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold">Invite a new user</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="person@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "editor")}
              className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <Button
            disabled={!email || inviteMut.isPending}
            onClick={() => inviteMut.mutate({ email: email.trim(), role })}
          >
            {inviteMut.isPending ? "Inviting…" : "Invite"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          If the user already has an account, they'll just be granted the role. Otherwise they'll receive an invite email.
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold">All users</h2>
        {isLoading && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="mt-3 text-sm text-destructive">{(error as Error).message}</p>}
        {data && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Roles</th>
                  <th className="py-2 pr-3">Last sign-in</th>
                  <th className="py-2 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u: AdminUserRow) => {
                  const isSelf = u.id === user?.id;
                  const isAdmin = u.roles.includes("admin");
                  const isEditor = u.roles.includes("editor");
                  return (
                    <tr key={u.id} className="border-t border-border">
                      <td className="py-2 pr-3">
                        <div className="font-medium">{u.email ?? "—"}</div>
                        {isSelf && <div className="text-[11px] text-muted-foreground">you</div>}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-1">
                          {u.roles.length === 0 && <span className="text-xs text-muted-foreground">none</span>}
                          {u.roles.map((r) => (
                            <span key={r} className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-medium">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">
                        {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : "never"}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex justify-end gap-2">
                          {!isAdmin ? (
                            <Button size="sm" variant="outline"
                              disabled={grantMut.isPending}
                              onClick={() => grantMut.mutate({ userId: u.id, role: "admin" })}>
                              Make admin
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline"
                              disabled={revokeMut.isPending || isSelf}
                              title={isSelf ? "You cannot remove your own admin role" : undefined}
                              onClick={() => revokeMut.mutate({ userId: u.id, role: "admin" })}>
                              Remove admin
                            </Button>
                          )}
                          {!isEditor ? (
                            <Button size="sm" variant="ghost"
                              disabled={grantMut.isPending}
                              onClick={() => grantMut.mutate({ userId: u.id, role: "editor" })}>
                              Make editor
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost"
                              disabled={revokeMut.isPending}
                              onClick={() => revokeMut.mutate({ userId: u.id, role: "editor" })}>
                              Remove editor
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
