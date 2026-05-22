import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { GlobalProvider } from "@/providers/GlobalProvider";
import { PageScaffold } from "@/ui/components/pageScaffold";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <PageScaffold />
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </GlobalProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
