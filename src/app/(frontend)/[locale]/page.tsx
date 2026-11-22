import Link from 'next/link'

import { AwardBanners } from '@/components/site/AwardBanners'
import { Pic } from '@/components/site/Pic'
import { SponsorTile } from '@/components/site/SponsorTile'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getT, global, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'home')
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const d = await getT(l)
  const [home, robots, sponsors] = await Promise.all([
    global('home', l),
    list('robots', l, { sort: '-season' }),
    list('sponsors', l, { where: { status: { not_equals: 'past' } }, sort: 'order' }),
  ])
  const pair = (home.pairImages ?? []).slice(0, 2)
  // main season robots only; off-season robots live on the robots page in their own section
  const seasonRobots = robots.filter((r) => !r.offSeason)
  // up to 5 robots side by side (page widens instead of shrinking cards); 6+ → two rows of 3
  const cols = seasonRobots.length >= 6 ? 3 : Math.max(1, seasonRobots.length)
  return (
    <>
      <section className="relative flex min-h-[560px] md:min-h-[720px] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 animate-slow"><Pic media={home.heroImage} priority sizes="100vw" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/90" />
        <div className="wrap relative z-10 pb-14">
          <span className="mono animate-fade text-foreground [animation-delay:0.15s]">{home.heroTag}</span>
          <h1 className="h1 my-4 mb-10 block overflow-hidden pb-[0.08em] text-[clamp(48px,10vw,160px)] [overflow-wrap:anywhere]">
            <span className="block animate-rise [animation-delay:0.05s]">{home.heroTitle}</span>
          </h1>
          <div className="flex animate-fade flex-wrap gap-3 [animation-delay:0.3s]">
            <Link href={`/${l}/join`} className={buttonVariants()}>{d.joinTeam}</Link>
            <Link href={`/${l}/robots`} className={buttonVariants({ variant: 'ghost' })}>{d.robots}</Link>
          </div>
        </div>
      </section>

      <section
        className="wrap sec !pb-20"
        style={{ maxWidth: seasonRobots.length > 3 && seasonRobots.length < 6 ? cols * 450 + 88 : undefined } as React.CSSProperties}
      >
        <h2 className="mono mb-14 block text-center">{d.robots}</h2>
        <div className="robot-grid gap-y-14" style={{ '--robot-cols': cols } as React.CSSProperties}>
          {seasonRobots.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-7 text-center">
              <Link href={`/${l}/robots/${r.slug}`} className="zoom h-[210px] md:h-[380px] w-full bg-panel"><Pic media={r.image} contain sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" /></Link>
              <div className="flex flex-col items-center gap-2.5"><span className="mono">{r.season}</span><h3 className="h2">{r.name}</h3></div>
              <Link href={`/${l}/robots/${r.slug}`} className={buttonVariants({ variant: 'ghost' })}>{d.detail}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rule wrap sec grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-16">
        <div>
          <h2 className="mono mb-6 block">{d.achievements}</h2>
          {home.highlights?.map((h) => (
            <div key={h.id} className="row md:grid-cols-[90px_1fr]"><span className="mono">{h.year}</span><h3 className="h2">{h.title}</h3></div>
          ))}
          <Link href={`/${l}/awards`} className={`${buttonVariants({ variant: 'ghost' })} mt-8`}>{d.allAwards}</Link>
        </div>
        <div>
          <div className="zoom h-[230px] md:h-[420px]"><Pic media={home.sideImage} /></div>
          <AwardBanners awards={robots.flatMap((r) => (r.awards ?? []).map((a) => ({ ...a, season: r.season })))} className="mt-8" />
        </div>
      </section>

      {pair.length > 0 && (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-2 pb-2">
          {pair.map((m, i) => <div key={i} className="zoom h-[310px] md:h-[560px]"><Pic media={m} /></div>)}
        </section>
      )}

      {sponsors.length > 0 && (
        <section className="wrap sec !pb-20">
          <h2 className="mono mb-8 block">{d.sponsors}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-x-2 gap-y-6">
            {sponsors.map((s) => <SponsorTile key={s.id} sponsor={s} />)}
          </div>
          <Link href={`/${l}/sponsors`} className={`${buttonVariants({ variant: 'ghost' })} mt-8`}>{d.allSponsors}</Link>
        </section>
      )}

      <section className="rule wrap sec flex flex-wrap items-baseline justify-between gap-5">
        <h3 className="h2">{home.ctaText}</h3>
        <Link href={`/${l}/join`} className={buttonVariants()}>{d.apply}</Link>
      </section>
    </>
  )
}
