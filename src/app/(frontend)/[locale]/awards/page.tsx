import { AwardBanners } from '@/components/site/AwardBanners'
import { PageHeading } from '@/components/site/PageHeading'
import { Pic } from '@/components/site/Pic'
import { isLocale } from '@/i18n/config'
import { getPage, getT, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'awards')
}

export default async function AwardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const [pg, d, robots] = await Promise.all([getPage('awards', l), getT(l), list('robots', l, { sort: '-season' })])
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      {robots.filter((r) => r.awards?.length).map((r) => (
        <section key={r.id} className="wrap grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] items-start gap-16 pb-24">
          <div>
            <div className="zoom h-[250px] md:h-[460px]"><Pic media={r.seasonPhoto} /></div>
            <AwardBanners awards={r.awards ?? []} season={r.season} className="mt-8" />
          </div>
          <div>
            <span className="mono block">{[r.name, r.game].filter(Boolean).join(', ')}</span>
            <h2 className="h2 mb-6 block">{r.season}</h2>
            {r.awards?.map((a) => <div key={a.id} className="row gap-y-1 md:gap-y-1"><span className="mono">{a.event}</span><h3 className="h2">{a.title}</h3></div>)}
          </div>
        </section>
      ))}
      {/* FRC award names are opaque to parents and first-time visitors: one plain-language line */}
      <section className="wrap pb-24">
        <p className="mono max-w-[720px] text-soft">{d.awardsNote}</p>
      </section>
    </>
  )
}
