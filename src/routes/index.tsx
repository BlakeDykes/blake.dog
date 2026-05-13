import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../ui/header";

const Index = () => {
  return <Header Component="h1">Home</Header>;
};

export const Route = createFileRoute("/")({
  component: Index,
});
