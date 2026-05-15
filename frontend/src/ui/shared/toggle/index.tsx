import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
} from "@base-ui/react/toggle";
import styles from "./index.module.scss";
import { cx } from "@/ui/utils";

type ToggleOwnProps<value extends string = string> = {
  Icon: React.ElementType<React.ComponentProps<"svg">>;
  PressedIcon: React.ElementType<React.ComponentProps<"svg">>;
  label: value;
};

type ToggleProps<value extends string = string> = ToggleOwnProps<value> &
  Omit<BaseToggleProps<value>, keyof ToggleOwnProps<value>>;

export const Toggle = <value extends string = string>({
  Icon,
  PressedIcon,
  label,
  ...rest
}: ToggleProps<value>) => {
  return (
    <div className={styles.container}>
      <BaseToggle
        aria-label={label}
        className={styles.button}
        onPressedChange={rest.onPressedChange}
        render={(props, state) => {
          const { className } = rest;
          const stateClassName =
            typeof className === "function" ? className(state) : rest.className;

          if (state.pressed) {
            return (
              <button
                type="button"
                {...props}
                className={cx(props.className, stateClassName as string)}
              >
                <PressedIcon className={styles.icon} />
              </button>
            );
          } else {
            return (
              <button
                type="button"
                {...props}
                className={cx(props.className, stateClassName as string)}
              >
                <Icon className={styles.icon} />
              </button>
            );
          }
        }}
      />
    </div>
  );
};
