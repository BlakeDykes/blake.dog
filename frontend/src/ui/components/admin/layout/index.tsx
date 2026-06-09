import type { AuthContext } from "@/features/auth/auth.types";
import { AdminDrawer } from "../drawer";
import { Drawer } from "@base-ui/react";
import { Flex } from "@/ui/shared/container/flex";

export const AdminLayout = ({ principal, logout }: AuthContext) => {
  const drawerHandle = Drawer.createHandle();
  return (
    <>
      <Drawer.Trigger handle={drawerHandle}>Admin</Drawer.Trigger>
      <AdminDrawer handle={drawerHandle} />
      <Flex>
        <span>{principal?.username}</span>
        <button onClick={logout}>Logout</button>
      </Flex>
    </>
  );
};
