export const isObjectType = (v: unknown) => {
  return typeof v === "object" && v !== null && !Array.isArray(v);
};
