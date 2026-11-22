import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { pageHeadingDefaults, uiDefaults, uiKeys, type Locale, type PageSlug } from '@/i18n/config'
import type { SectionKey } from '@/lib/sections'
import type { Media } from '@/payload-types'

export const payload = () => getPayload({ config })

type GlobalSlug = 'site-settings' | 'home' | 'about' | 'navigation' | 'resources' | 'ui-text'

// React cache(): the same global is read once per request, however many components ask for it
const readGlobal = cache(async (slug: GlobalSlug, locale: Locale) => (await payload()).findGlobal({ slug, locale, depth: 1 }))

export const global = <S extends GlobalSlug>(slug: S, locale: Locale) =>
  readGlobal(slug, locale) as Promise<Awaited<ReturnType<Awaited<ReturnType<typeof payload>>['findGlobal']>> & import('@/payload-types').Config['globals'][S]>

export async function list<S extends 'robots' | 'sponsors' | 'posts' | 'products' | 'gallery-images'>(
  collection: S,
  locale: Locale,
  opts: { where?: object; limit?: number; sort?: string } = {},
) {
  const res = await (await payload()).find({
    collection,
    locale,
    depth: 1,
    limit: opts.limit ?? 100,
    sort: opts.sort,
    // the local API skips access rules, so drafts are filtered out here
    where: (collection === 'posts' ? { and: [opts.where ?? {}, { _status: { equals: 'published' } }] } : opts.where) as never,
  })
  return res.docs
}

/** UI strings: Payload value when filled in, otherwise the code default. */
export const getT = cache(async (locale: Locale) => {
  const g = (await global('ui-text', locale)) as unknown as Record<string, unknown>
  const out: Record<string, string> = { ...uiDefaults[locale] }
  for (const k of uiKeys) if (typeof g[k] === 'string' && g[k]) out[k] = g[k] as string
  return out as Record<(typeof uiKeys)[number], string>
})

/** Pages entry for a route (heading, intro, SEO) with code fallbacks. */
export const getPage = cache(async (slug: string, locale: Locale) => {
  const res = await (await payload()).find({
    collection: 'pages', locale, depth: 1, limit: 1, where: { slug: { equals: slug } },
  })
  const doc = res.docs[0]
  return {
    exists: Boolean(doc),
    heading: doc?.heading || doc?.title || pageHeadingDefaults[locale][slug as PageSlug] || slug,
    intro: doc?.intro ?? undefined,
    body: doc?.body,
    seo: doc?.seo,
    /** Section switch from the panel (Sayfalar → Bölümler): visible unless explicitly turned off. */
    show: (key: SectionKey) => doc?.sections?.[key] !== false,
  }
})

export const mediaUrl = (m: number | Media | null | undefined) =>
  m && typeof m === 'object' ? (m.url ?? undefined) : undefined

/** The blog is "open" only while at least one post is published. */
export const hasPosts = cache(async () => {
  const { totalDocs } = await (await payload()).count({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
  })
  return totalDocs > 0
})
