import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "../features/auth/providers/auth";
import { defaultQueryFn } from "@/api/defaultQueryFn";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchInterval: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
            staleTime: Infinity,
            queryFn: defaultQueryFn,
          },
          mutations: {
            retry: 0,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => console.error("[Query error]", error),
        }),
        mutationCache: new MutationCache({
          onError: (error) => console.error("[Mutation error]", error),
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
