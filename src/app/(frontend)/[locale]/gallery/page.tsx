import { GalleryGrid, type GalleryItem } from '@/components/site/GalleryGrid'
import { PageHeading } from '@/components/site/PageHeading'
import { isLocale } from '@/i18n/config'
import { getPage, getT, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'gallery')
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const [d, pg, docs] = await Promise.all([getT(l), getPage('gallery', l), list('gallery-images', l, { sort: 'order' })])
  const items = docs.flatMap((g): GalleryItem[] =>
    typeof g.image === 'object' && g.image.url ? [{ src: g.image.url, alt: g.image.alt }] : [],
  )
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap pb-36">
        <GalleryGrid items={items} labels={{ view: d.viewLarge, close: d.close, previous: d.previous, next: d.next }} />
      </section>
    </>
  )
}
