export const browser = {
  get isClient(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
  },

  get window(): Window | undefined {
    return this.isClient ? window : undefined;
  },

  get document(): Document | undefined {
    return this.isClient ? document : undefined;
  },

  get localStorage(): Storage | undefined {
    return this.isClient && "localStorage" in window
      ? window.localStorage
      : undefined;
  },
};
