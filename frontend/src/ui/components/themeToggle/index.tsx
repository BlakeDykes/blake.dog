import { MoonSVG } from "@/assets/svg/moon";
import { SunSVG } from "@/assets/svg/sun";
import { useThemeMode } from "@/ui/theme/context";
import { Toggle } from "@/ui/shared/toggle";
import styles from "./index.module.scss";
import { useCallback } from "react";
import type { ToggleState } from "@base-ui/react";

export const ThemeToggle = () => {
  const { theme, toggle } = useThemeMode();

  const iconWrapperClassName = useCallback(
    (state: ToggleState) =>
      state.pressed ? styles.sunWrapper : styles.moonWrapper,
    []
  );

  return (
    <div className={styles.container}>
      <Toggle
        Icon={MoonSVG}
        PressedIcon={SunSVG}
        defaultPressed={theme === "light"}
        onPressedChange={toggle}
        label={"Theme Toggle"}
        className={iconWrapperClassName}
      />
    </div>
  );
};
