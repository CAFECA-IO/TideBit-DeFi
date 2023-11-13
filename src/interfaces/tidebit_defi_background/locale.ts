export type ILocale = {locale: string};
export type TranslateFunction = (s: string) => string;

export const locales = ['tw', 'en', 'cn'];

export type ILocaleType = 'tw' | 'en' | 'cn';
export interface ILocaleConstant {
  TW: ILocaleType;
  EN: ILocaleType;
  CN: ILocaleType;
}

export const Locale: ILocaleConstant = {
  TW: 'tw',
  EN: 'en',
  CN: 'cn',
};
