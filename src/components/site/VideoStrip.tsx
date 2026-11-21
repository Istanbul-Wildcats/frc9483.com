import { ArrowUpRight } from 'lucide-react'

export type Video = { id: string; url: string; title?: string | null }

/** Thumbnail grid: hovering darkens the image and shows a centered link-out button that opens YouTube */
export function VideoStrip({ videos, name, play }: { videos: Video[]; name: string; play: string }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-x-5 gap-y-8" role="group" aria-label={name}>
      {videos.map((v, i) => {
        const title = v.title || `${name} ${i + 1}`
        return (
          <figure key={v.id}>
            <a
              href={`https://youtu.be/${v.id}`}
              target="_blank"
              rel="noopener"
              aria-label={`${play}: ${title}`}
              className="group relative block aspect-video overflow-hidden bg-panel outline-offset-4 focus-visible:outline-2 focus-visible:outline-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:bg-black/25 [@media(hover:none)]:opacity-100">
                <span className="grid size-16 place-items-center text-white transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 md:size-20">
                  <ArrowUpRight aria-hidden className="size-14 md:size-[72px]" strokeWidth={1.75} />
                </span>
              </span>
            </a>
            <figcaption className="mt-3 text-base">{title}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
