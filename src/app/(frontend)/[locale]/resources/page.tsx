import { ArrowUpRight } from 'lucide-react'

import { PageHeading } from '@/components/site/PageHeading'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { youtubeId } from '@/lib/youtube'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'resources')
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const pg = await getPage('resources', l)
  const [r, d, robots] = await Promise.all([global('resources', l), getT(l), list('robots', l, { sort: '-season' })])
  const videos = robots.flatMap((rb) =>
    (rb.videos ?? []).flatMap((v, i) => {
      const id = youtubeId(v.url)
      return id ? [{ id, title: v.title || `${rb.name} ${i + 1}`, robot: `${rb.name} · ${rb.season}` }] : []
    }),
  )
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap pb-36">
        {r.links?.map((x) => (
          <a key={x.id} href={x.url} target={x.url.startsWith('http') ? '_blank' : undefined} rel="noopener" className="row"><h3 className="h2">{x.label}</h3></a>
        ))}
        {videos.length > 0 && (
          <>
            <h2 className="mono mb-6 mt-16 block">{d.videosLabel}</h2>
            {videos.map((v) => (
              <a key={v.id} href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener" className="row group md:grid-cols-[1fr_auto]">
                <span className="flex flex-col gap-1">
                  <span className="text-[clamp(20px,2vw,26px)]">{v.title}</span>
                  <span className="mono">{v.robot}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-6 text-muted transition-colors group-hover:text-white" />
                <span className="sr-only">({d.newTab})</span>
              </a>
            ))}
          </>
        )}
      </section>
    </>
  )
}
