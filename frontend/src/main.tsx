import { StrictMode, useEffect } from "react";
import "@/styles/global.scss";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { AuthContext } from "./features/auth/auth.types";
import { useAuth } from "./features/auth/providers/auth/context";
import { ApiProvider } from "./api/ApiProvider";

const router = createRouter({
  routeTree,
  context: { auth: undefined! as AuthContext },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();

  // Re-run route guards (beforeLoad) whenever auth resolves or changes, so a
  // route that was entered during the "checking" window redirects once the
  // session result is known.
  useEffect(() => {
    router.invalidate();
  }, [auth.status]);

  return <RouterProvider router={router} context={{ auth }} />;
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ApiProvider>
        <InnerApp />
      </ApiProvider>
    </StrictMode>
  );
}
