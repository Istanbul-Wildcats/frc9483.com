'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Texts = { title: string; back: string }

/** The language comes from the URL (/en/... or /tr/...), so one 404 page serves both without becoming dynamic. */
export function NotFoundContent({ texts }: { texts: Record<'tr' | 'en', Texts> }) {
  const locale = usePathname().startsWith('/en') ? 'en' : 'tr'
  const t = texts[locale]
  return (
    <section className="wrap flex flex-col items-start gap-8 py-24" lang={locale}>
      <h1 className="h1">404</h1>
      <p className="h2">{t.title}</p>
      <Link href={`/${locale}`} className="inline-flex min-h-11 items-center gap-2 hover:text-white">
        <ArrowLeft aria-hidden className="size-4" /> {t.back}
      </Link>
    </section>
  )
}
