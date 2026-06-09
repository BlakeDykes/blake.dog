import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/ui/shared/header";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div>
      <Header Component="h1">About</Header>
    </div>
  );
}
