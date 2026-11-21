import type { Metadata } from 'next'

import { locales, type Locale, type PageSlug } from '@/i18n/config'
import type { Media } from '@/payload-types'

import { getPage, global, mediaUrl } from './payload'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.frc9483.com').replace(/\/$/, '')

/** Absolute URL for a stored media file. */
export const abs = (m: number | Media | null | undefined) => {
  const u = mediaUrl(m)
  return u ? new URL(u, SITE_URL).toString() : undefined
}

export const pathFor = (locale: Locale, slug: string, rest = '') =>
  `/${locale}${slug && slug !== 'home' ? `/${slug}` : ''}${rest}`

/** canonical + hreflang for a path that exists in every locale */
const alternates = (locale: Locale, path: (l: Locale) => string): Metadata['alternates'] => ({
  canonical: path(locale),
  languages: { ...Object.fromEntries(locales.map((l) => [l, path(l)])), 'x-default': path('tr') },
})

type Entry = { title: string; description?: string; image?: Media | number | null; path: (l: Locale) => string; noIndex?: boolean; type?: 'website' | 'article'; publishedTime?: string; modifiedTime?: string; ogDescription?: string }

export async function buildMetadata(locale: Locale, e: Entry): Promise<Metadata> {
  const s = await global('site-settings', locale)
  const description = e.description || s.description || undefined
  const image = abs(e.image) ?? abs(s.ogImage)
  return {
    title: e.title,
    description,
    alternates: alternates(locale, e.path),
    robots: e.noIndex
      ? { index: false, follow: false }
      : e.type === 'article'
        ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
        : undefined,
    openGraph: {
      ...(e.type === 'article'
        ? { type: 'article' as const, publishedTime: e.publishedTime, modifiedTime: e.modifiedTime }
        : { type: 'website' as const }),
      title: e.title,
      description: e.ogDescription || description,
      url: e.path(locale),
      siteName: s.siteName,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: e.title, description: e.ogDescription || description, images: image ? [image] : undefined },
  }
}

/** generateMetadata for a plain route backed by a Pages entry */
export async function pageMetadata(locale: Locale, slug: PageSlug | (string & {})): Promise<Metadata> {
  const p = await getPage(slug, locale)
  return buildMetadata(locale, {
    // the home page uses the bare site name (layout default); other pages use "Heading · FRC#9483"
    title: p.seo?.title || p.heading,
    description: p.seo?.description || p.intro,
    image: p.seo?.image,
    noIndex: p.seo?.noIndex ?? false,
    path: (l) => pathFor(l, slug),
  })
}
