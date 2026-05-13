import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/users")({ component: UsersAdmin });

function UsersAdmin() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Users</h1>
      <p className="text-sm text-muted-foreground">Invite teammates by sharing the signup link, then grant them a role from the database.</p>
      <Card className="mt-6 p-6 space-y-3 text-sm">
        <div><strong>Signup link:</strong> <code>/login</code> (toggle to "Sign up")</div>
        <div><strong>Your user id:</strong> <code className="break-all">{user?.id}</code></div>
        <div className="text-muted-foreground">
          To grant access, run in the database: <br />
          <code className="block mt-1 rounded bg-secondary p-2 text-xs">{`INSERT INTO public.user_roles (user_id, role) VALUES ('<user-id>', 'admin');`}</code>
        </div>
      </Card>
    </div>
  );
}
