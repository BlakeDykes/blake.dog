import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useAuth } from "../auth/context";



export const ApiProvider = ({ children } : { children : React.ReactNode }) => {
  const [ queryClient ] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
        retry: 1,
        staleTime: 0,
      },
      mutations: {
        retry: 0
      }
    }
  }));

  const { principal } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}