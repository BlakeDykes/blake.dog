import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";
import { cx } from "../../../utils";
import styles from "./index.module.scss";

type FlexOwnProps<T extends ElementType = "div"> = {
  component?: T;
  children?: ReactNode;
  direction?: CSSProperties["flexDirection"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  wrap?: CSSProperties["flexWrap"];
  gap?: CSSProperties["gap"];
  flex?: CSSProperties["flex"];
  grow?: CSSProperties["flexGrow"];
  shrink?: CSSProperties["flexShrink"];
  basis?: CSSProperties["flexBasis"];
  className?: string;
  style?: CSSProperties;
};

type FlexProps<T extends ElementType> = FlexOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof FlexOwnProps<T>>;

export const Flex = <T extends ElementType = "div">({
  component,
  children,
  direction,
  justify,
  align,
  wrap,
  gap,
  flex,
  grow,
  shrink,
  basis,
  className,
  style,
  ...rest
}: FlexProps<T>) => {
  const Component = component ?? "div";

  return (
    <Component
      className={cx(className, styles.flex)}
      style={{
        display: "flex",
        ...(flex && { flex }),
        ...(direction && { flexDirection: direction }),
        ...(justify && { justifyContent: justify }),
        ...(align && { alignItems: align }),
        ...(wrap && { flexWrap: wrap }),
        ...(gap && { gap }),
        ...(grow && { flexGrow: grow }),
        ...(shrink && { flexShrink: shrink }),
        ...(basis && { flexBasis: basis }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
