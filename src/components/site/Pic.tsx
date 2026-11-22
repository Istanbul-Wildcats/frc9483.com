import Image from 'next/image'

import type { Media } from '@/payload-types'

export function Pic({
  media,
  className,
  contain,
  priority,
  sizes = '(min-width: 768px) 50vw, 100vw',
}: {
  media: number | Media | null | undefined
  className?: string
  contain?: boolean
  priority?: boolean
  sizes?: string
}) {
  if (!media || typeof media !== 'object' || !media.url) return null
  return (
    <Image
      src={media.url}
      alt={media.alt}
      fill
      quality={90}
      sizes={sizes}
      priority={priority}
      style={contain ? undefined : { objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }}
      /* explicit so SSR and hydration agree (Next 16 fill images disagree on the default) */
      loading={priority ? undefined : 'lazy'}
      className={`${contain ? 'object-contain p-5' : 'object-cover'} ${className ?? ''}`}
    />
  )
}
