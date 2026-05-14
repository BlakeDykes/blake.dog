import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../ui/header";
import { Text } from "../ui/text";

const About = () => {
  return (
    <div>
      <Header Component="h1">About Me</Header>
      <Header Component="h3">H3</Header>
      <Text text="hi" />
    </div>
  );
};

export const Route = createFileRoute("/about")({
  component: About,
});
