import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { getT, global, hasPosts } from '@/lib/payload'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [s, nav, blogOpen] = await Promise.all([global('site-settings', locale), global('navigation', locale), hasPosts()])
  const d = await getT(locale)
  return (
    <footer className="rule pt-20 pb-10">
      <div className="wrap flex flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <span className="text-[clamp(40px,10vw,160px)] leading-[0.92] tracking-[0.01em]" style={{ fontFamily: 'var(--font-display)' }}>{s.footerTitle}</span>
          <span className="mono text-sm">{s.footerSubtitle}</span>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <span className="mono">{d.team}</span>
            {nav.links?.filter((l) => blogOpen || l.href !== '/blog').map((l) => (
              <Link key={l.id} href={`/${locale}${l.href}`} className="link-u self-start pb-0.5 text-soft hover:text-white">{l.label}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-3.5">
            <span className="mono">{d.contact}</span>
            {s.email && <a href={`mailto:${s.email}`} className="link-u self-start pb-0.5 text-soft hover:text-white">{s.email}</a>}
            {s.socials?.map((x) => (
              <a key={x.id} href={x.url} target="_blank" rel="noopener" className="link-u self-start pb-0.5 text-soft hover:text-white">{x.label}<span className="sr-only"> ({d.newTab})</span></a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6">
          <span className="mono">© {new Date().getFullYear()} {s.siteName}</span>
        </div>
      </div>
    </footer>
  )
}
