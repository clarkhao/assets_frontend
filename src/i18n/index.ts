export const i18n = {
  defaultLocale: "en",
  locales: ["en", "jp", "cn"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import.meta.glob("./dict/en.json", { eager: true }),
  cn: () => import.meta.glob("./dict/cn.json", { eager: true }),
  jp: () => import.meta.glob("./dict/jp.json", { eager: true }),
};
// @ts-ignore
export const getDictionary = (locale: Locale) => dictionaries[locale]()[`./dict/${locale}.json`].default;
