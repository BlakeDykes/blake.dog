import { Drawer } from "@base-ui/react/drawer";
import styles from "./index.module.scss";
import { Link as RouterLink } from "@tanstack/react-router";
import { Link, Stack } from "@blakedykes/ui";
import { NavigationMenu } from "@base-ui/react";

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
              <Drawer.Description className={styles.Description}>
                <Stack>
                  <NavigationMenu.Root>
                    <NavigationMenu.List>
                      <NavigationMenu.Item>
                        <Link render={<RouterLink to="/admin" />}>
                          Dashboard
                        </Link>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item>
                        <Link render={<RouterLink to="/admin/posts" />}>
                          Posts
                        </Link>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item>
                        <Link render={<RouterLink to="/admin/media" />}>
                          Media
                        </Link>
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                  </NavigationMenu.Root>
                </Stack>
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
