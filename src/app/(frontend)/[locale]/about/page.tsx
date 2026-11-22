import Link from 'next/link'

import { Pic } from '@/components/site/Pic'
import { PageHeading } from '@/components/site/PageHeading'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'about')
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const d = await getT(l)
  const pg = await getPage('about', l)
  const a = await global('about', l)
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <div className="zoom h-[340px] md:h-[620px]"><Pic media={a.heroImage} priority sizes="100vw" /></div>
      <section className="wrap sec grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <h2 className="sec-title">{d.who}</h2>
          <p className="text-[clamp(28px,3.4vw,52px)] leading-[1.15]">{a.lead}</p>
          {a.paragraphs?.map((p) => <p key={p.id} className="max-w-[680px] text-xl leading-relaxed text-soft">{p.text}</p>)}
          <p className="h2 !text-[clamp(24px,2.6vw,36px)]">{a.tagline}</p>
        </div>
        <div className="lg:sticky lg:top-8">
          <div className="zoom h-[340px] md:h-[560px]"><Pic media={a.whoImage} /></div>
        </div>
      </section>
      {pg.show('aboutStats') && <section className="rule wrap grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        {a.stats?.map((s) => (
          <div key={s.id} className="lift flex flex-col gap-3"><span className="text-[clamp(56px,7vw,112px)] leading-none">{s.value}</span><span className="mono">{s.label}</span></div>
        ))}
      </section>}
      {pg.show('aboutRankings') && <section className="wrap pb-[120px]">
        <h2 className="sec-title mb-8">{d.rankings}</h2>
        {a.rankings?.map((r) => (
          <div key={r.id} className="row md:grid-cols-[140px_1fr_1fr]"><span className="mono">{r.year}</span><h3 className="h2">{r.title}</h3><span className="mono md:justify-self-end">{r.result}</span></div>
        ))}
      </section>}
      {pg.show('aboutPhotos') && (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-2 pb-2">
          {(a.pairImages ?? []).slice(0, 2).map((m, i) => <div key={i} className="zoom h-[290px] md:h-[520px]"><Pic media={m} /></div>)}
        </section>
      )}
      {pg.show('aboutTeams') && <section className="rule wrap sec">
        <h2 className="sec-title mb-8">{d.teams}</h2>
        {a.teams?.map((x, i) => (
          <div key={x.id} className="row"><h3 className="h2">{x.name}</h3></div>
        ))}
        {/* the page's primary audience is prospective members: give them the next step */}
        <div className="mt-10"><Link href={`/${l}/join`} className={buttonVariants({ size: 'sm' })}>{d.join}</Link></div>
      </section>}
    </>
  )
}
