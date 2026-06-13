import { Heading } from "@blakedykes/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  return (
    <div>
      <Heading level={1}>Admin: Dashboard</Heading>
    </div>
  );
}
