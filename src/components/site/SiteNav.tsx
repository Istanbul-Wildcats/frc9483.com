import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import type { Locale } from '@/i18n/config'
import { getT, global, hasPosts } from '@/lib/payload'

import { LocaleSwitch } from './LocaleSwitch'
import { MobileMenu } from './MobileMenu'

export async function SiteNav({ locale }: { locale: Locale }) {
  const [nav, d, blogOpen] = await Promise.all([global('navigation', locale), getT(locale), hasPosts()])
  const links = (nav.links ?? []).filter((l) => blogOpen || l.href !== '/blog').map((l) => ({ id: l.id, label: l.label, href: `/${locale}${l.href}` }))
  const join = (
    <Link href={`/${locale}/join`} className={buttonVariants({ size: 'sm' })}>
      {d.join}
    </Link>
  )
  return (
    <header className="relative">
      <div className="wrap flex items-center justify-between gap-6 py-4">
        {/* wordmark instead of a bitmap logo: always sharp, same white as the old logo */}
        <Link href={`/${locale}`} aria-label="Overcharge 9483" className="wordmark text-[clamp(40px,5vw,56px)] leading-none text-white transition-opacity hover:opacity-80">
          9483
        </Link>
        <nav aria-label="Main" className="hidden flex-wrap items-center justify-end gap-x-7 xl:flex">
          {links.map((l) => (
            <Link key={l.id} href={l.href} className="inline-flex min-h-11 items-center text-sm tracking-[0.04em] text-soft transition-colors hover:text-white">
              <span className="link-u pb-0.5">{l.label}</span>
            </Link>
          ))}
          <LocaleSwitch locale={locale} />
          {join}
        </nav>
        <div className="flex items-center gap-3 xl:hidden">
          {join}
          <MobileMenu links={links} labels={{ open: d.menu, close: d.closeMenu }}>
            <LocaleSwitch locale={locale} />
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}
