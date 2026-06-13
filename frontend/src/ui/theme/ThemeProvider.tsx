import { useState, useEffect, useCallback, useMemo } from "react";
import { browser } from "@/utils/browser";
import type { ThemeMode, ThemeModeContext } from "./types";
import { ThemeModeCtx } from "./context";

const getModePref = (): ThemeMode => {
  const cachedTheme = browser.localStorage?.getItem("theme");

  return cachedTheme
    ? JSON.parse(cachedTheme)
    : browser.window?.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

const getBrandPref = (): string | undefined => {
  const cachedBrand = browser.localStorage?.getItem("brand");
  return cachedBrand ? JSON.parse(cachedBrand) : "kh";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(getModePref);
  const [brand] = useState<string | undefined>(getBrandPref);

  useEffect(() => {
    browser.localStorage?.setItem("theme", JSON.stringify(theme));
    browser.document?.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (brand !== undefined) {
      browser.localStorage?.setItem("brand", JSON.stringify(brand));
      browser.document?.documentElement.setAttribute("data-brand", brand);
    }
  }, [brand]);

  const toggleTheme = useCallback(() => {
    setTheme((prev: ThemeMode) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const mContext: ThemeModeContext = useMemo(
    () => ({ theme, toggle: toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeModeCtx.Provider value={mContext}>{children}</ThemeModeCtx.Provider>
  );
};
