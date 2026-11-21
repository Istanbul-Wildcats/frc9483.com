import type { Sponsor } from '@/payload-types'

import { Pic } from './Pic'

/** Logo (white on transparent PNG) when there is one, otherwise the brand name as a wordmark; legal name underneath. */
export function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const hasLogo = sponsor.logo && typeof sponsor.logo === 'object'
  return (
    <div>
      <div className="relative flex h-[120px] items-center justify-center border border-line p-5 text-center">
        {hasLogo ? <Pic media={sponsor.logo} contain sizes="260px" /> : <span className="h2 !text-[clamp(20px,2vw,26px)]">{sponsor.name}</span>}
      </div>
      <span className="sr-only">{sponsor.legalName || sponsor.name}</span>
    </div>
  )
}
