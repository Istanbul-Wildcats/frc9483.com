import { notFound } from 'next/navigation'

import { PageHeading } from '@/components/site/PageHeading'
import { RichBody } from '@/components/site/RichBody'
import { isLocale } from '@/i18n/config'
import { getPage } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Any page created in Payload (Pages collection) that has no dedicated route renders here. */
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata(locale, slug)
}

export default async function CustomPage({ params }: Props) {
  const { locale: l, slug } = await params
  if (!isLocale(l)) notFound()
  const pg = await getPage(slug, l)
  if (!pg.exists) notFound()
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap pb-36">
        {pg.intro && <p className="h2 mb-12 max-w-[820px]">{pg.intro}</p>}
        <RichBody data={pg.body} />
      </section>
    </>
  )
}
