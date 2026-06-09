import { useState, useEffect, useCallback, useMemo } from "react";
import { browser } from "@/utils/browser";
import type { ThemeMode, ThemeModeContext } from "./types";
import { ThemeModeCtx } from "./context";

const getModePref = (): ThemeMode => {
  const cached = browser.localStorage?.getItem("theme");
  return cached
    ? JSON.parse(cached)
    : browser.window?.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(getModePref);

  useEffect(() => {
    browser.localStorage?.setItem("theme", JSON.stringify(theme));
    browser.document?.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev: ThemeMode) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const mContext: ThemeModeContext = useMemo(
    () => ({ theme, toggle }),
    [theme, toggle]
  );

  return (
    <ThemeModeCtx.Provider value={mContext}>{children}</ThemeModeCtx.Provider>
  );
};
