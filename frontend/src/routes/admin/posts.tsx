import { Heading } from "@blakedykes/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/posts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Heading level={1}>Admin: Posts</Heading>
    </div>
  );
}
