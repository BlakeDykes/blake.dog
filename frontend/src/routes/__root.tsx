import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { PageScaffold } from "@/ui/components/pageScaffold";
import type { AuthContext } from "@/features/auth/auth.types";
import { ThemeProvider } from "@/ui/theme/ThemeProvider";
import { defaultHeadScript, MetaComponent } from "@/Meta";

export interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  head: defaultHeadScript,
});

function RootComponent() {
  return (
    <>
      <MetaComponent />
      <ThemeProvider>
        <PageScaffold />
        <Outlet />
        <TanStackRouterDevtools initialIsOpen={false} />
      </ThemeProvider>
      <Scripts />
    </>
  );
}
