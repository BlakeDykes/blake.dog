import { Drawer } from "@base-ui/react/drawer";
import styles from "./index.module.scss";
import { Link } from "@/ui/shared/link";
import { NavigationMenu } from "@base-ui/react";
import { Flex } from "@/ui/shared/container/flex";

export const AdminDrawer = ({ handle }: { handle: Drawer.Handle<unknown> }) => {
  return (
    <Drawer.Root
      handle={handle}
      swipeDirection="down"
      modal={false}
      disablePointerDismissal
    >
      <Drawer.Portal>
        <Drawer.Viewport className={styles.Viewport}>
          <Drawer.Popup className={styles.Popup}>
            <Drawer.Content className={styles.Content}>
              <Drawer.Title className={styles.Title}>Admin Links</Drawer.Title>
              <Drawer.Description
                className={styles.Description}
                render={(props) => <Flex direction="column" {...props} />}
              >
                <NavigationMenu.Root>
                  <NavigationMenu.List>
                    <NavigationMenu.Item>
                      <Link to="/admin">Dashboard</Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <Link href="/admin/posts">Posts</Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <Link href="/admin/media">Media</Link>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </Drawer.Description>
              <div className={styles.Actions}>
                <Drawer.Close className={styles.Button}>Close</Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
