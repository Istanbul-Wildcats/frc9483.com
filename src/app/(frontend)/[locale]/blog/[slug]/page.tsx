import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Pic } from '@/components/site/Pic'
import { RichBody } from '@/components/site/RichBody'
import { buttonVariants } from '@/components/ui/button'
import { isLocale, locales } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { getPage, global, list } from '@/lib/payload'
import { abs, buildMetadata, SITE_URL } from '@/lib/seo'
import { lexicalText, snippet } from '@/lib/text'

type Props = { params: Promise<{ locale: string; slug: string }> }

async function load(locale: string, slug: string) {
  if (!isLocale(locale)) return null
  const [p] = await list('posts', locale, { where: { slug: { equals: slug } }, limit: 1 })
  if (!p) return null
  // Everything search engines and link previews need is derived from the post itself;
  // the optional SEO fields in the admin only override it.
  return {
    locale,
    p,
    title: p.seo?.title || p.title,
    description: p.seo?.description || p.excerpt || snippet(lexicalText(p.content)),
    image: p.seo?.image || p.cover,
  }
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(locales.map(async (locale) => (await list('posts', locale)).map((p) => ({ locale, slug: p.slug }))))
  return perLocale.flat()
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const post = await load(locale, slug)
  if (!post) return {}
  const { p } = post
  return buildMetadata(post.locale, {
    title: post.title,
    description: post.description,
    // the date is part of the shared text, so it shows in previews that ignore article:published_time
    ogDescription: [formatDate(p.date, post.locale), post.description].filter(Boolean).join(' - '),
    image: post.image,
    noIndex: p.seo?.noIndex ?? false,
    type: 'article',
    publishedTime: p.date,
    modifiedTime: p.updatedAt,
    path: (l) => `/${l}/blog/${slug}`,
  })
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await load(locale, slug)
  if (!post) notFound()
  const { p, locale: l } = post
  const [s, blog] = await Promise.all([global('site-settings', l), getPage('blog', l)])
  const url = `${SITE_URL}/${l}/blog/${slug}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title.slice(0, 110),
      description: post.description || undefined,
      datePublished: p.date,
      dateModified: p.updatedAt,
      image: [abs(post.image) ?? abs(s.ogImage)].filter(Boolean),
      inLanguage: l,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: s.siteName, url: `${SITE_URL}/${l}` },
      publisher: { '@type': 'Organization', name: s.siteName, url: `${SITE_URL}/${l}` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: s.siteName, item: `${SITE_URL}/${l}` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/${l}/blog` },
        { '@type': 'ListItem', position: 3, name: p.title, item: url },
      ],
    },
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="wrap">
        <div className="mx-auto max-w-[820px]">
          <header className="flex flex-col gap-5 pt-12 pb-10 md:pt-16">
            <Link href={`/${l}/blog`} className="inline-flex min-h-11 items-center gap-2 self-start text-sm text-soft transition-colors hover:text-white">
              <ArrowLeft aria-hidden className="size-4" /> {blog.heading}
            </Link>
            <time dateTime={p.date} className="mono">{formatDate(p.date, l)}</time>
            <h1 className="h1 !text-[clamp(32px,5.2vw,64px)] !normal-case !leading-[1.08] text-balance">{p.title}</h1>
            {p.excerpt && <p className="text-xl leading-relaxed text-soft">{p.excerpt}</p>}
          </header>
          {p.cover && <div className="zoom aspect-[16/9] w-full"><Pic media={p.cover} priority sizes="(min-width: 900px) 820px, 100vw" /></div>}
          <article className="py-12 md:py-16 [&_.prose-site]:max-w-none">
            <RichBody data={p.content} />
          </article>
          <div className="rule py-10">
            <Link href={`/${l}/blog`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <ArrowLeft aria-hidden className="size-4" /> {blog.heading}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
