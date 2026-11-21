import { PageHeading } from '@/components/site/PageHeading'
import { buttonVariants } from '@/components/ui/button'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'join')
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const d = await getT(l)
  const pg = await getPage('join', l)
  const s = await global('site-settings', l)
  const url = s.forms?.joinUrl
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap sec flex flex-col items-start gap-8 !pt-0">
        <p className="h2 max-w-[720px]">{pg.intro || d.joinIntro}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener" className={buttonVariants()}>
            {d.openForm}<span className="sr-only"> ({d.newTab})</span>
          </a>
        )}
        
      </section>
    </>
  )
}
