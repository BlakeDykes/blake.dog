export type ThemeMode = "light" | "dark";

export type ThemeModeContext = {
  theme: ThemeMode;
  toggle: () => void;
};
