import { useAuth } from "@/features/auth/providers/auth/context";
import { AdminLayout } from "@/ui/components/admin/layout";
import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminComponent,
  beforeLoad: ({ context }) => {
    // Don't redirect while the session is still being checked — wait for it to
    // resolve (the router is invalidated on auth status change in main.tsx).
    if (context.auth.isChecking) return;

    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

function AdminComponent() {
  const authContext = useAuth();

  // Never render the admin shell before the session resolves.
  if (authContext.isChecking) {
    return null;
  }

  if (!authContext.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <AdminLayout {...authContext} />
      <Outlet />
    </div>
  );
}
