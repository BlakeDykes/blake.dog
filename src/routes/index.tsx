import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../ui/header";
import { Flex } from "../ui/container/flex";
import styles from "@/ui/header/index.module.scss";

const Index = () => {
  return (
    <Flex>
      <Header Component="h1">Normal</Header>
      <Header Component="h1" className={styles.med}>
        Medium
      </Header>
      <Header Component="h1" className={styles.bold}>
        Bold
      </Header>
    </Flex>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
