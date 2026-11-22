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
  const offCols = offSeason.length >= 6 ? 3 : Math.max(1, offSeason.length)
  const card = (r: (typeof robots)[number]) => (
    <article key={r.id} className="flex flex-col items-center gap-6 text-center">
      <Link href={`/${l}/robots/${r.slug}`} className="zoom h-[220px] md:h-[400px] w-full bg-panel"><Pic media={r.image} contain sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" /></Link>
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
        {season.map(card)}
      </section>
      {offSeason.length > 0 && (
        <>
          <section className="wrap">
            <h2 className="mono mb-10 block">{d.offSeasonRobots}</h2>
          </section>
          <section
            className="robot-grid wrap gap-y-16 pb-36"
            style={{ '--robot-cols': offCols, maxWidth: offSeason.length > 3 && offSeason.length < 6 ? offCols * 450 + 88 : undefined } as React.CSSProperties}
          >
            {offSeason.map(card)}
          </section>
        </>
      )}
    </>
  )
}
