import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { Link } from "@/ui/shared/link";
import { Text } from "@/ui/shared/text";
import styles from "./index.module.scss";

export const Navigation = () => {
  return (
    <NavigationMenu.Root className={styles.root}>
      <NavigationMenu.List className={styles.list}>
        <NavigationMenu.Item className={styles.item}>
          <Link to="/">
            <Text text="Home" />
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item className={styles.item}>
          <Link to="/about">
            <Text text="About" />
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
