import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { PageScaffold } from "@/ui/components/pageScaffold";
import type { AuthContext } from "@/features/auth/auth.types";
import { ThemeProvider } from "@/ui/theme/ThemeProvider";

export interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <PageScaffold />
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}
