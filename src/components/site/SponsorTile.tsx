import { webUrl } from '@/lib/url'
import type { Sponsor } from '@/payload-types'

import { Pic } from './Pic'

/** Logo (white on transparent PNG) when there is one, otherwise the brand name as a wordmark; legal name underneath. */
export function SponsorTile({ sponsor, newTab }: { sponsor: Sponsor; newTab: string }) {
  const hasLogo = sponsor.logo && typeof sponsor.logo === 'object'
  const href = webUrl(sponsor.url)
  const tile = (
    <>
      <div className="lift relative flex h-[120px] items-center justify-center border border-line p-5 text-center transition-colors group-hover:border-white/60 group-hover:bg-white/[0.05] group-focus-visible:border-white/60 [&_img]:transition-transform [&_img]:duration-300 group-hover:[&_img]:scale-105">
        {hasLogo ? <Pic media={sponsor.logo} contain sizes="260px" /> : <span className="h2 !text-[clamp(20px,2vw,26px)]">{sponsor.name}</span>}
      </div>
      <span className="sr-only">{sponsor.legalName || sponsor.name}{href ? ` (${newTab})` : ''}</span>
    </>
  )
  // the whole tile links to the sponsor's site when the panel has an address for it
  return href ? (
    <a href={href} target="_blank" rel="noopener" className="group block">{tile}</a>
  ) : (
    <div className="group">{tile}</div>
  )
}
