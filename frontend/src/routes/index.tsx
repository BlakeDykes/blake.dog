import { createFileRoute } from "@tanstack/react-router";
import { Heading, Stack } from "@blakedykes/ui";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <Stack>
      <Heading level={1}>Home</Heading>
    </Stack>
  );
}
