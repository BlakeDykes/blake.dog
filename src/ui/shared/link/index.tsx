import { Link as TanstackLink, type LinkProps } from "@tanstack/react-router";
// import styles from "./index.module.scss";
import { cx } from "@/ui/utils";

export const Link = (props: LinkProps & { className?: string }) => {
  const { className, children } = props;
  return (
    <TanstackLink className={cx(className)} {...props}>
      {children}
    </TanstackLink>
  );
};
