import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/ui/shared/header";

const About = () => {
  return (
    <div>
      <Header Component="h1">About</Header>
    </div>
  );
};

export const Route = createFileRoute("/about")({
  component: About,
});
