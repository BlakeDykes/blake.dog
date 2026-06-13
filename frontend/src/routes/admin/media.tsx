import { Heading } from "@blakedykes/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/media")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Heading level={1}>Admin: Media</Heading>
    </div>
  );
}
