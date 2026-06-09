import { createContext, useContext } from "react";

export const createStrictContext = <T>(hookName: string) => {
  const Ctx = createContext<T | null>(null);
  const useStrict = () => {
    const v = useContext(Ctx);
    if (!v) throw new Error(`${hookName} must be used within its Provider`);
    return v;
  };
  return [Ctx, useStrict] as const;
};
