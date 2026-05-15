import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/ui/shared/header";
import { Flex } from "@/ui/shared/container/flex";

const Index = () => {
  return (
    <Flex>
      <Header Component="h1">Home</Header>
    </Flex>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
