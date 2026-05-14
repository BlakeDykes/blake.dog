import { createStrictContext } from "../utils";
import { type ThemeModeContext } from "./types";

export const [ThemeModeCtx, useThemeMode] =
  createStrictContext<ThemeModeContext>("ThemeContext");
