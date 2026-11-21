import type { Locale } from '@/i18n/config'

/** "21 Kasım 2026" / "21 November 2026" */
export const formatDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
