import { createStrictContext } from "@/providers/utils";
import { type ThemeModeContext } from "./types";

export const [ThemeModeCtx, useThemeMode] =
  createStrictContext<ThemeModeContext>("ThemeContext");
