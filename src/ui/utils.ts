export const cx = (
  ...classNames: readonly (string | null | undefined | false)[]
): string | undefined => classNames.filter(Boolean).join(" ") || undefined;
