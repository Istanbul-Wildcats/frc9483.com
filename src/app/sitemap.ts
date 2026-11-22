import type { MetadataRoute } from 'next'

import { locales, pageSlugs } from '@/i18n/config'
import { payload } from '@/lib/payload'
import { pathFor, SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const p = await payload()
  const [pages, robots, posts] = await Promise.all([
    p.find({ collection: 'pages', limit: 100, depth: 0, pagination: false, select: { slug: true, seo: true } }),
    p.find({ collection: 'robots', limit: 100, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
    p.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 500, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
  ])
  const hidden = new Set<string>(pages.docs.filter((d) => d.seo?.noIndex).map((d) => d.slug))
  if (posts.docs.length === 0) hidden.add('blog') // the blog is closed until the first post is published
  const entry = (path: (l: (typeof locales)[number]) => string, lastModified?: string) =>
    locales.map((l) => ({
      url: SITE_URL + path(l),
      lastModified,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, SITE_URL + path(x)])) },
    }))
  return [
    ...[...new Set<string>([...pageSlugs, ...pages.docs.map((d) => d.slug)])]
      .filter((s) => !hidden.has(s))
      .flatMap((s) => entry((l) => pathFor(l, s))),
    ...robots.docs.flatMap((r) => entry((l) => `/${l}/robots/${r.slug}`, r.updatedAt)),
    ...posts.docs.flatMap((r) => entry((l) => `/${l}/blog/${r.slug}`, r.updatedAt)),
  ]
}
