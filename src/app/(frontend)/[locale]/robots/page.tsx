import Link from 'next/link'

import { PageHeading } from '@/components/site/PageHeading'
import { Pic } from '@/components/site/Pic'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getPage, getT, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'robots')
}

export default async function RobotsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const d = await getT(l)
  const pg = await getPage('robots', l)
  const robots = await list('robots', l, { sort: '-season' })
  // up to 5 robots side by side (page widens instead of shrinking cards); 6+ → two rows of 3
  const season = robots.filter((r) => !r.offSeason)
  const offSeason = robots.filter((r) => r.offSeason)
  const cols = season.length >= 6 ? 3 : Math.max(1, season.length)
  // off-season cards stay tile-sized like the main grid: always 3 tracks (a single robot fills one third, like a normal robot card)
  const offCols = 3
  // 1 robot → centered in the 3-track area; 2 → fill from the left; 3+ → left-aligned rows
  const card = (r: (typeof robots)[number], extra = '') => (
    <article key={r.id} className={`card lift flex flex-col items-center gap-6 text-center ${extra}`}>
      <Link href={`/${l}/robots/${r.slug}`} className="zoom stage h-[220px] md:h-[400px] w-full"><Pic media={r.image} contain sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" /></Link>
      <span className="mono">{r.season}</span>
      <h2 className="h2">{r.name}</h2>
      <Link href={`/${l}/robots/${r.slug}`} className={buttonVariants({ variant: 'ghost' })}>{d.detail}</Link>
    </article>
  )
  return (
    <>
      <PageHeading center>{pg.heading}</PageHeading>
      <section
        className="robot-grid wrap gap-y-16 pb-36"
        style={{ '--robot-cols': cols, maxWidth: season.length > 3 && season.length < 6 ? cols * 450 + 88 : undefined } as React.CSSProperties}
      >
        {season.map((r) => card(r))}
      </section>
      {offSeason.length > 0 && pg.show('robotsOffSeason') && (
        <>
          <section className="wrap">
            <h2 className="sec-title mb-10">{d.offSeasonRobots}</h2>
          </section>
          <section className="robot-grid wrap gap-y-16 pb-36" style={{ '--robot-cols': offCols } as React.CSSProperties}>
            {offSeason.map((r) => card(r, offSeason.length === 1 ? 'md:col-start-2' : ''))}
          </section>
        </>
      )}
    </>
  )
}
