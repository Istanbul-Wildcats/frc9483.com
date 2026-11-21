import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHeading } from '@/components/site/PageHeading'
import { isLocale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { getPage, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'blog')
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const pg = await getPage('blog', l)
  const posts = await list('posts', l, { sort: '-date' })
  if (posts.length === 0) notFound() // no posts = the blog is closed
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap pb-36">
        {posts.map((p) => (
          <Link key={p.id} href={`/${l}/blog/${p.slug}`} className="row md:grid-cols-[200px_1fr]">
            <time dateTime={p.date} className="mono">{formatDate(p.date, l)}</time>
            <div className="flex flex-col gap-2">
              <h3 className="h2">{p.title}</h3>
              {p.excerpt && <p className="max-w-[640px] text-lg text-soft">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </section>
    </>
  )
}
