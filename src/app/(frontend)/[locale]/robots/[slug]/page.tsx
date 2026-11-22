import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { notFound } from 'next/navigation'

import { AwardBanners } from '@/components/site/AwardBanners'
import { Pic } from '@/components/site/Pic'
import { SeasonTable } from '@/components/site/SeasonTable'
import { VideoStrip } from '@/components/site/VideoStrip'
import { isLocale, locales } from '@/i18n/config'
import { getT, list } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { wordmarkClass } from '@/lib/text'
import { youtubeId } from '@/lib/youtube'

// Pre-render every robot in every language so navigating to one is instant (no server work per click).
export async function generateStaticParams() {
  const perLocale = await Promise.all(locales.map(async (locale) => (await list('robots', locale)).map((r) => ({ locale, slug: r.slug }))))
  return perLocale.flat()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const [r] = await list('robots', locale, { where: { slug: { equals: slug } }, limit: 1 })
  if (!r) return {}
  return buildMetadata(locale, {
    title: `${r.name} · ${r.season}`,
    description: r.awards?.map((a) => `${a.event}: ${a.title}`).join(', '),
    image: r.image,
    path: (l) => `/${l}/robots/${slug}`,
  })
}

export default async function RobotPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: l, slug } = await params
  if (!isLocale(l)) notFound()
  const [r] = await list('robots', l, { where: { slug: { equals: slug } }, limit: 1 })
  if (!r) notFound()
  const d = await getT(l)
  // Season robots fall back to the official season pages; off-season robots have none, so they show only the links filled in the panel.
  const auto = (url: string) => (r.offSeason ? undefined : url)
  const season = [
    { name: 'The Blue Alliance', url: r.links?.tba || auto(`https://www.thebluealliance.com/team/9483/${r.season}`) },
    { name: 'Statbotics', url: r.links?.statbotics || auto(`https://www.statbotics.io/team/9483/${r.season}`) },
    { name: 'FIRST Events', url: r.links?.firstEvents || auto(`https://frc-events.firstinspires.org/${r.season}/team/9483`) },
  ].flatMap((x) => (x.url ? [{ name: x.name, url: x.url }] : []))
  const sources: { name: string; url: string; note?: string }[] = [
    ...season,
    ...(r.links?.youtube ? [{ name: 'YouTube', url: r.links.youtube }] : []),
    ...(r.links?.chiefDelphi
      ? [{ name: r.links.chiefDelphiTitle || 'Chief Delphi', url: r.links.chiefDelphi, note: 'Chief Delphi' }]
      : []),
  ]
  const videos = (r.videos ?? []).flatMap((v) => {
    const id = youtubeId(v.url)
    return id ? [{ id, url: v.url, title: v.title }] : []
  })
  // empty sections stay hidden until the team fills stats/awards from the panel
  const hasStats = (r.events ?? []).some((e) => e.rank != null || e.wins || e.losses || e.ties)
  const hasAwards = (r.awards?.length ?? 0) > 0
  return (
    <>
      <section className="wrap flex flex-col gap-10 py-12">
        <Link href={`/${l}/robots`} className="inline-flex min-h-11 items-center self-start text-sm text-soft hover:text-white"><ArrowLeft aria-hidden className="size-4" /> {d.back}</Link>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className={`h1 ${wordmarkClass(r.name)}`}>{r.name}</h1>
          <span className="mono">{[r.season, r.game].filter(Boolean).join(', ')}</span>
        </div>
      </section>
      <div className="zoom stage h-[370px] md:h-[680px]"><Pic media={r.image} contain priority sizes="100vw" /></div>
      {r.cadImage && (
        <section className="wrap sec">
          <h2 className="sec-title mb-8">{d.cadView}</h2>
          <div className="zoom stage h-[370px] md:h-[680px]"><Pic media={r.cadImage} contain sizes="100vw" /></div>
        </section>
      )}
      {(hasStats || hasAwards || r.epaRank) && (
        <section className="wrap sec grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] items-start gap-16">
          <div>
            <SeasonTable events={r.events ?? []} labels={{ title: d.seasonSummary, event: d.tableEvent, rank: d.tableRank, record: d.tableRecord, total: d.tableTotal, of: d.tableOf }} />
            {r.epaRank && <div className="row md:grid-cols-[150px_1fr]"><span className="mono">EPA</span><span className="text-[clamp(20px,2vw,26px)]">{r.epaRank}</span></div>}
            <AwardBanners awards={r.awards ?? []} season={r.season} className="mt-10" />
          </div>
          {hasAwards && (
            <div>
              <h2 className="sec-title mb-8">{d.seasonAwards}</h2>
              {r.awards?.map((a) => <div key={a.id} className="row gap-y-1 md:gap-y-1"><span className="mono">{a.event}</span><h3 className="text-[clamp(20px,2vw,26px)]">{a.title}</h3></div>)}
            </div>
          )}
        </section>
      )}
      {videos.length > 0 && (
        <section className="wrap sec !pt-0">
          <h2 className="sec-title mb-8">{d.highlights}</h2>
          <VideoStrip videos={videos} name={`${r.name} ${d.highlights}`} play={d.playVideo} />
        </section>
      )}
      {sources.length > 0 && <section className="wrap pb-[120px]">
        <h2 className="sec-title mb-8">{d.sources}</h2>
        {sources.map((x) => (
          <a key={x.name} href={x.url} target="_blank" rel="noopener" className="row group md:grid-cols-[1fr_auto]">
            <span className="flex flex-col gap-1">
              <span className="text-[clamp(20px,2vw,26px)]">{x.name}</span>
              <span className="mono">{x.note ?? `${r.season} ${d.sourceNote}`}</span>
            </span>
            <ArrowUpRight aria-hidden className="size-6 text-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            <span className="sr-only">({d.newTab})</span>
          </a>
        ))}
      </section>}
    </>
  )
}
