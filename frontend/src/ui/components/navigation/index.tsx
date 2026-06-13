import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { Link as RouterLink } from "@tanstack/react-router";
import { Link, Text } from "@blakedykes/ui";
import styles from "./index.module.scss";

export const Navigation = () => {
  return (
    <NavigationMenu.Root className={styles.root}>
      <NavigationMenu.List className={styles.list}>
        <NavigationMenu.Item className={styles.item}>
          <Link render={<RouterLink to="/" />}>
            <Text>Home</Text>
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className={styles.item}>
          <Link render={<RouterLink to="/about" />}>
            <Text>About</Text>
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
