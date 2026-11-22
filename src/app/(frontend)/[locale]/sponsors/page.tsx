import { SecTitle } from '@/components/site/SecTitle'
import Link from 'next/link'

import { PageHeading } from '@/components/site/PageHeading'
import { SponsorTile } from '@/components/site/SponsorTile'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'sponsors')
}

export default async function SponsorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const [d, pg, all, s] = await Promise.all([getT(l), getPage('sponsors', l), list('sponsors', l, { sort: 'order' }), global('site-settings', l)])
  const active = all.filter((s) => s.status !== 'past')
  const past = all.filter((s) => s.status === 'past')
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap">
        <SecTitle className="mb-10">{d.activeSponsors}</SecTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] sm:gap-x-2 sm:gap-y-6">
          {active.map((s) => <SponsorTile key={s.id} sponsor={s} newTab={d.newTab} />)}
        </div>
      </section>
      {past.length > 0 && pg.show('sponsorsPast') && (
        <section className="wrap pt-20">
          <SecTitle className="mb-10">{d.pastSponsors}</SecTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] sm:gap-x-2 sm:gap-y-6">
            {past.map((s) => <SponsorTile key={s.id} sponsor={s} newTab={d.newTab} />)}
          </div>
        </section>
      )}
      {pg.show('sponsorsCta') && (
        <section className="wrap sec flex flex-wrap items-baseline justify-between gap-5">
          <h2 className="h2">{d.sponsorCta}</h2>
          <div className="flex flex-wrap items-baseline gap-6">
            {s.email && <a href={`mailto:${s.email}`} className="mono underline decoration-line-strong underline-offset-4 transition-colors hover:text-white hover:decoration-white">{s.email}</a>}
            <Link href={`/${l}/contact`} className={buttonVariants()}>{d.writeUs}</Link>
          </div>
        </section>
      )}
    </>
  )
}
