import Link from 'next/link'

import { PageHeading } from '@/components/site/PageHeading'
import { Pic } from '@/components/site/Pic'
import { isLocale } from '@/i18n/config'
import { getPage, getT, list } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'shop')
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const [d, pg, items] = await Promise.all([getT(l), getPage('shop', l), list('products', l, { sort: '-createdAt' })])
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap flex flex-col items-start gap-8 pb-36">
        {items.length === 0 ? (
          <>
            <p className="h2 max-w-[720px] text-soft">{d.noProducts}</p>
            {/* the shop has no order mechanism yet: give the visitor the one path that exists */}
            <Link href={`/${l}/contact`} className="mono underline decoration-line-strong underline-offset-4 hover:text-white">{d.orderNote}</Link>
          </>
        ) : (
          // one square card per product, fixed width: a single product never stretches into a bar. w-full: the section is flex-col items-start, so without it the grid shrinks to one column
          <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(220px,100%),280px))] gap-x-6 gap-y-12">
            {items.map((p) => (
              <li key={p.id} className="card lift flex flex-col items-center gap-4 text-center">
                <div className="zoom stage aspect-square w-full">
                  <Pic media={p.image} contain sizes="280px" />
                </div>
                <p className="text-[clamp(20px,2vw,26px)] leading-tight">{p.name}</p>
                {typeof p.quantity === 'number' && (
                  <p className="mono">{p.quantity > 0 ? `${p.quantity} ${d.unitsSuffix}` : d.soldOut}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <Link href={`/${l}/contact`} className="mono underline decoration-line-strong underline-offset-4 hover:text-white">{d.orderNote}</Link>
        )}
      </section>
    </>
  )
}
