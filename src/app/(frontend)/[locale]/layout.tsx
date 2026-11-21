import { Anta } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteNav } from '@/components/site/SiteNav'
import { isLocale, locales } from '@/i18n/config'
import { getT, global, mediaUrl } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

import '../globals.css'

const anta = Anta({ subsets: ['latin', 'latin-ext'], weight: '400', variable: '--font-anta' })

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const s = await global('site-settings', locale)
  const dark = mediaUrl(s.favicon)
  const light = mediaUrl(s.faviconLight) ?? dark
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.siteName, template: '%s · FRC#9483' },
    description: s.description ?? undefined,
    applicationName: s.siteName,
    // transparent PNGs: the browser picks white or black by the device/browser theme
    icons: dark
      ? {
          icon: [
            { url: light!, media: '(prefers-color-scheme: light)', type: 'image/png' },
            { url: dark, media: '(prefers-color-scheme: dark)', type: 'image/png' },
          ],
          apple: dark,
        }
      : undefined,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [s, d] = await Promise.all([global('site-settings', locale), getT(locale)])
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: s.siteName,
    sport: 'FIRST Robotics Competition',
    url: `${SITE_URL}/${locale}`,
    email: s.email ?? undefined,
    sameAs: s.socials?.map((x) => x.url),
  }
  return (
    <html lang={locale} className={anta.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:text-black">{d.skipToContent}</a>
        <SiteNav locale={locale} />
        <main id="content">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  )
}
