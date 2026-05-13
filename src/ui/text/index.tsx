import styles from "./index.module.scss";

export const Text = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  return <p className={className ?? "" + styles.text}>{text}</p>;
};
