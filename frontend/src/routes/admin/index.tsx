import { Header } from "@/ui/shared/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  return (
    <div>
      <Header Component="h1">Admin: Dashboard</Header>
    </div>
  );
}
