'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

export function MobileMenu({
  links,
  labels,
  children,
}: {
  links: { id?: string | null; href: string; label: string }[]
  labels: { open: string; close: string }
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-pill border border-line-strong transition-transform duration-150 active:scale-90"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>
      {open && (
        <nav id="mobile-menu" aria-label={labels.open} className="absolute inset-x-0 top-full z-40 border-t border-line bg-black px-5 pb-6">
          {links.map((l) => (
            <Link key={l.id ?? l.href} href={l.href} className="flex min-h-12 items-center border-b border-line text-lg text-soft hover:text-white">
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between">{children}</div>
        </nav>
      )}
    </div>
  )
}
