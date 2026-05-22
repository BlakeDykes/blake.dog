import { apiKeys } from "@/api/queryKeys";

export const authKeys = {
  user: () => apiKeys.get("/auth/user"),
  isAuthQueryKey: (queryKey: readonly unknown[]) => {
    return (
      queryKey[0] === "api" &&
      queryKey[1] === "GET" &&
      queryKey[2] === "/auth/user"
    );
  },
};
