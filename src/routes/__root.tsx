import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navigation } from "../ui/navigation";

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
