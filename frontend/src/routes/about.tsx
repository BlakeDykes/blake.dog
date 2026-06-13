import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "@blakedykes/ui";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div>
      <Heading level={1}>About</Heading>
    </div>
  );
}
