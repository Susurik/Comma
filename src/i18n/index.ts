/**
 * i18n — Comma App
 *
 * Internationalization module using expo-localization + custom loader.
 * No external i18n library required — keeps bundle minimal.
 *
 * Usage:
 *   import { t, setLocale } from '@/src/i18n'
 *   t('navigation.dashboard')  // => "Painel" (in pt-BR)
 */

import * as Localization from 'expo-localization'

import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'

export type SupportedLocale = 'en' | 'pt-BR'

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

export type TranslationKey = NestedKeyOf<typeof en>

const translations: Record<SupportedLocale, typeof en> = {
  en,
  'pt-BR': ptBR,
}

let currentLocale: SupportedLocale = 'en'

/**
 * Detects and sets the locale from the device's system language.
 * Falls back to 'en' when the device locale is not supported.
 */
export function detectLocale(): SupportedLocale {
  const deviceLocale = Localization.getLocales()[0]?.languageTag ?? 'en'

  if (deviceLocale.startsWith('pt')) {
    return 'pt-BR'
  }

  return 'en'
}

/** Override the active locale at runtime (e.g. from user Settings). */
export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale
}

export function getLocale(): SupportedLocale {
  return currentLocale
}

/**
 * Resolves a dot-separated translation key in the current locale.
 * Falls back to English when the key is missing in the active locale.
 *
 * @example
 *   t('navigation.dashboard')  // "Painel"
 *   t('common.save')           // "Salvar"
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const parts = (key as string).split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolve = (obj: any): string => {
    return parts.reduce((acc, part) => acc?.[part], obj) ?? ''
  }

  let result = resolve(translations[currentLocale])

  if (!result) {
    result = resolve(translations['en'])
  }

  if (params && result) {
    Object.entries(params).forEach(([paramKey, value]) => {
      result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value))
    })
  }

  return result || key
}

// Auto-detect on module load
currentLocale = detectLocale()
