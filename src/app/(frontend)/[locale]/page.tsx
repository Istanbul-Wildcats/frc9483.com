import { SecTitle } from '@/components/site/SecTitle'
import Link from 'next/link'

import { AwardBanners } from '@/components/site/AwardBanners'
import { Pic } from '@/components/site/Pic'
import { SponsorTile } from '@/components/site/SponsorTile'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { Wordmark, wordmarkUpperFits } from '@/components/site/Wordmark'
import { wordmarkClass } from '@/lib/text'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'home')
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const d = await getT(l)
  const [home, pg, robots, sponsors] = await Promise.all([
    global('home', l),
    getPage('home', l),
    list('robots', l, { sort: '-season' }),
    list('sponsors', l, { where: { status: { not_equals: 'past' } }, sort: 'order' }),
  ])
  const pair = (home.pairImages ?? []).slice(0, 2)
  // main season robots only; off-season robots live on the robots page in their own section
  const seasonRobots = robots.filter((r) => !r.offSeason)
  // up to 5 robots side by side (page widens instead of shrinking cards); 6+ → two rows of 3
  const cols = seasonRobots.length >= 6 ? 3 : Math.max(1, seasonRobots.length)
  // hero darkness from the panel (0-100): heaviest where the title sits, so the photo stays visible up top
  const o = Math.min(100, Math.max(0, home.heroOverlay ?? 70)) / 100
  const scrim = `linear-gradient(to bottom, rgb(0 0 0 / ${o * 0.4}) 0%, rgb(0 0 0 / ${o * 0.25}) 35%, rgb(0 0 0 / ${o}) 70%, rgb(0 0 0 / ${Math.min(1, o * 1.35)}) 100%)`
  return (
    <>
      <section className="relative flex min-h-[560px] md:min-h-[720px] items-end overflow-hidden bg-black">
        <div className="absolute inset-0 animate-slow"><Pic media={home.heroImage} priority sizes="100vw" /></div>
        <div className="absolute inset-0" style={{ background: scrim }} />
        <div className="wrap relative z-10 pb-14">
          <span className={`${wordmarkClass(home.heroTag) || 'font-display'} block animate-fade text-[clamp(28px,4vw,52px)] leading-none text-white [animation-delay:0.15s] [text-shadow:0_2px_24px_rgb(0_0_0/0.55)]`}>{home.heroTag}</span>
          <h1 className={`h1 ${wordmarkUpperFits(home.heroTitle) ? 'wordmark hero-wm' : 'text-[clamp(48px,10vw,160px)]'} my-4 mb-10 -ml-[0.1em] block overflow-hidden pb-[0.08em] pl-[0.1em] pr-[0.1em] [overflow-wrap:anywhere] [text-shadow:0_2px_32px_rgb(0_0_0/0.55)]`}>
            <span className="block animate-rise [animation-delay:0.05s]">{wordmarkUpperFits(home.heroTitle) ? <Wordmark text={home.heroTitle} /> : home.heroTitle}</span>
          </h1>
          <div className="flex animate-fade flex-wrap gap-3 [animation-delay:0.3s]">
            <Link href={`/${l}/join`} className={buttonVariants()}>{d.joinTeam}</Link>
            <Link href={`/${l}/robots`} className={buttonVariants({ variant: 'ghost' })}>{d.robots}</Link>
          </div>
        </div>
      </section>

      {pg.show('homeRobots') && <section
        className="wrap sec !pb-20"
        style={{ maxWidth: seasonRobots.length > 3 && seasonRobots.length < 6 ? cols * 450 + 88 : undefined } as React.CSSProperties}
      >
        <SecTitle className="mb-14 text-center">{d.robots}</SecTitle>
        <div className="robot-grid gap-y-12" style={{ '--robot-cols': cols } as React.CSSProperties}>
          {seasonRobots.map((r) => (
            <div key={r.id} className="card lift flex flex-col items-center gap-5 text-center md:gap-7">
              <Link href={`/${l}/robots/${r.slug}`} className="zoom stage h-[210px] md:h-[380px] w-full"><Pic media={r.image} contain sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" /></Link>
              <div className="flex flex-col items-center gap-2.5"><span className="mono">{r.season}</span><h3 className={`h2 ${wordmarkClass(r.name)}`}>{r.name}</h3></div>
              <Link href={`/${l}/robots/${r.slug}`} className={buttonVariants({ variant: 'ghost' })}>{d.detail}</Link>
            </div>
          ))}
        </div>
      </section>}

      {pg.show('homeAchievements') && <section className="rule wrap sec grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-16">
        <div>
          <SecTitle className="mb-8">{d.achievements}</SecTitle>
          {home.highlights?.map((h) => (
            <div key={h.id} className="row grid-cols-[64px_1fr] md:grid-cols-[90px_1fr]"><span className="mono">{h.year}</span><h3 className="h2">{h.title}</h3></div>
          ))}
          <Link href={`/${l}/awards`} className={`${buttonVariants({ variant: 'ghost' })} mt-8`}>{d.allAwards}</Link>
        </div>
        <div>
          <div className="zoom h-[200px] md:h-[420px]"><Pic media={home.sideImage} /></div>
          <AwardBanners awards={robots.flatMap((r) => (r.awards ?? []).map((a) => ({ ...a, season: r.season })))} className="mt-8" />
        </div>
      </section>}

      {pair.length > 0 && pg.show('homePhotos') && (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-2 pb-2">
          {pair.map((m, i) => <div key={i} className="zoom h-[220px] md:h-[560px]"><Pic media={m} /></div>)}
        </section>
      )}

      {sponsors.length > 0 && pg.show('homeSponsors') && (
        <section className="wrap sec !pb-20">
          <SecTitle className="mb-10">{d.sponsors}</SecTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] sm:gap-x-2 sm:gap-y-6">
            {sponsors.map((s) => <SponsorTile key={s.id} sponsor={s} newTab={d.newTab} />)}
          </div>
          <Link href={`/${l}/sponsors`} className={`${buttonVariants({ variant: 'ghost' })} mt-8`}>{d.allSponsors}</Link>
        </section>
      )}

      {pg.show('homeCta') && (
        <section className="rule wrap sec flex flex-wrap items-baseline justify-between gap-5">
          <h3 className="h2">{home.ctaText}</h3>
          <Link href={`/${l}/join`} className={buttonVariants()}>{d.apply}</Link>
        </section>
      )}
    </>
  )
}
