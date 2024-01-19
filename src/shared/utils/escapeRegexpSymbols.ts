export const escapeRegexpSymbols = (str: string) =>
  str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
