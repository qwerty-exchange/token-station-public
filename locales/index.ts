export const englishLocale = 'en'
export const chineseLocale = 'zh'

export const availableLocales = [englishLocale, chineseLocale]

export interface Locale {
  name: string
  flag: string
  locale: string
}

export const english = {
  name: 'English',
  flag: '/flags/us.png',
  locale: englishLocale
}

export const locales: Locale[] = [english]
