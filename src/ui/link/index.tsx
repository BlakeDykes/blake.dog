import { Link as TanstackLink, type LinkProps } from "@tanstack/react-router";
import styles from "./index.module.scss";

export const Link = (props: LinkProps & { className?: string }) => {
  const { className, children } = props;
  return (
    <TanstackLink className={className ?? "" + styles.link} {...props}>
      {children}
    </TanstackLink>
  );
};
