import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/ui/shared/header";
import { Flex } from "@/ui/shared/container/flex";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <Flex>
      <Header Component="h1">Home</Header>
    </Flex>
  );
}
