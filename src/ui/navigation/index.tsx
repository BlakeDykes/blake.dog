import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { Link } from "../link";
import { Text } from "../text";
import styles from "./index.module.scss";

export const Navigation = () => {
  return (
    <NavigationMenu.Root className={styles.navigation}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <Link to="/">
            <Text text="Home" />
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link to="/about">
            <Text text="About" />
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
