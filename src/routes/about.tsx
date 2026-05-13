import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../ui/header";
import { Text } from "../ui/text";

const About = () => {
  return (
    <div>
      <Header Component="h1">About Me</Header>
      <Text text="hi" />
    </div>
  );
};

export const Route = createFileRoute("/about")({
  component: About,
});
