/**
 * useTranslation — React hook for i18n
 *
 * Thin wrapper around the i18n module that re-renders the component
 * whenever the locale changes via setLocale().
 *
 * Usage:
 *   const { t, locale, setLocale } = useTranslation()
 *   <Text>{t('navigation.dashboard')}</Text>
 */

import { useCallback, useState } from 'react'

import {
  SupportedLocale,
  TranslationKey,
  getLocale,
  setLocale as setGlobalLocale,
  t as translate,
} from './index'

export function useTranslation() {
  const [locale, setLocaleState] = useState<SupportedLocale>(getLocale)

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setGlobalLocale(newLocale)
    setLocaleState(newLocale)
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(key, params),
    // Re-run whenever locale changes so all components update in sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  return { t, locale, setLocale }
}
