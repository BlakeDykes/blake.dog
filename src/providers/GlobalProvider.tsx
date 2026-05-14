import { ThemeProvider } from "./theme/ThemeProvider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
