import { cx } from "@/ui/utils";
import styles from "./index.module.scss";

export const Text = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  return <p className={cx(className, styles.text)}>{text}</p>;
};
