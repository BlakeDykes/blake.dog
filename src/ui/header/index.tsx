import styles from "./index.module.scss";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const Header = ({
  Component,
  ...props
}: {
  Component: HeadingTag;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <div className={styles.hContainer}>
      <Component {...props} />
    </div>
  );
};
