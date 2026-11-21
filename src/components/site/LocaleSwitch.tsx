'use client'

import { usePathname } from 'next/navigation'

import { locales, type Locale } from '@/i18n/config'

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const path = usePathname()
  const rest = path.replace(/^\/(tr|en)/, '') || ''
  return (
    <nav aria-label={locale === 'tr' ? 'Dil seçimi' : 'Language'} className="flex items-center gap-2 text-sm">
      {locales.map((l) => (
        <a
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          onClick={() => {
            document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`
          }}
          className={`inline-flex min-h-11 items-center uppercase transition-colors ${l === locale ? 'text-white' : 'text-soft hover:text-white'}`}
        >
          {l}
        </a>
      ))}
    </nav>
  )
}
