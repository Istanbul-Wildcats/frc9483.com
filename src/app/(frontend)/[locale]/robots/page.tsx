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
  return (
    <>
      <PageHeading center>{pg.heading}</PageHeading>
      <section className="wrap grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-10 gap-y-16 pb-36">
        {robots.map((r) => (
          <article key={r.id} className="flex flex-col items-center gap-6 text-center">
            <Link href={`/${l}/robots/${r.slug}`} className="zoom h-[220px] md:h-[400px] w-full bg-panel"><Pic media={r.image} contain sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" /></Link>
            <span className="mono">{r.season}</span>
            <h3 className="h2">{r.name}</h3>
            <Link href={`/${l}/robots/${r.slug}`} className={buttonVariants({ variant: 'ghost' })}>{d.detail}</Link>
          </article>
        ))}
      </section>
    </>
  )
}
