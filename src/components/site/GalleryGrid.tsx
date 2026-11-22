'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryItem = { src: string; alt: string; caption?: string }

type Labels = { view: string; close: string; previous: string; next: string }

/** Thumbnail grid; a click opens the photo in a focused viewer (native <dialog>: focus trap, Esc, focus return). */
export function GalleryGrid({ items, labels }: { items: GalleryItem[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const item = items[index]

  const show = (i: number) => {
    setIndex(i)
    setOpen(true)
    dialog.current?.showModal()
  }
  const step = useCallback((d: number) => setIndex((i) => (i + d + items.length) % items.length), [items.length])

  // no page scroll behind the viewer
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-2">
        {items.map((g, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`${labels.view}: ${g.alt}`}
              className="zoom aspect-[4/3] cursor-zoom-in active:opacity-80"
            >
              <Image src={g.src} alt="" fill quality={75} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </button>
            {g.caption && <span className="mono line-clamp-1 text-muted">{g.caption}</span>}
          </div>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label={item?.alt}
        className="lightbox"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(-1)
          if (e.key === 'ArrowRight') step(1)
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        }}
      >
        {open && item && (
          <div className="relative h-[min(80dvh,860px)] w-full">
            <Image key={item.src} src={item.src} alt={item.alt} fill quality={75} sizes="(min-width: 1280px) 1180px, 94vw" className="object-contain" priority />
            <span className="lb-count mono" aria-live="polite">
              {index + 1} / {items.length}
            </span>
            <button type="button" onClick={() => dialog.current?.close()} aria-label={labels.close} className="lb-btn right-3 top-3">
              <X aria-hidden className="size-5" />
            </button>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className="lb-btn left-3 top-1/2 -translate-y-1/2">
                  <ChevronLeft aria-hidden className="size-6" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={labels.next} className="lb-btn right-3 top-1/2 -translate-y-1/2">
                  <ChevronRight aria-hidden className="size-6" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
