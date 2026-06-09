import { Header } from "@/ui/shared/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/posts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header Component="h1">Admin: Posts</Header>
    </div>
  );
}
