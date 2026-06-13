import type { AuthContext } from "@/features/auth/auth.types";
import { AdminDrawer } from "../drawer";
import { Drawer } from "@base-ui/react";
import { Button, Stack, Text } from "@blakedykes/ui";

export const AdminLayout = ({ principal, logout }: AuthContext) => {
  const drawerHandle = Drawer.createHandle();
  return (
    <>
      <Drawer.Trigger handle={drawerHandle}>Admin</Drawer.Trigger>
      <AdminDrawer handle={drawerHandle} />
      <Stack direction="row" align="center">
        <Text>{principal?.username}</Text>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </Stack>
    </>
  );
};
