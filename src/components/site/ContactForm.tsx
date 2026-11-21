'use client'

import { useActionState, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { sendContact, type ContactState } from '@/lib/contact-action'

type Labels = {
  name: string; email: string; topic: string; message: string; send: string; sending: string
  successTitle: string; successText: string
  topics: Record<'sponsorship' | 'collaboration' | 'join' | 'other', string>
}

const field = 'w-full border-0 border-b border-line-strong bg-transparent py-3 text-lg text-foreground placeholder:text-muted/70 focus:border-white focus:outline-none focus-visible:outline-none'

export function ContactForm({ locale, labels }: { locale: string; labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' })
  const [ts, setTs] = useState('')
  useEffect(() => setTs(String(Date.now())), [])

  if (state.status === 'ok') {
    return (
      <div role="status" className="flex flex-col gap-3 border border-line p-8">
        <h2 className="h2">{labels.successTitle}</h2>
        <p className="text-lg text-soft">{labels.successText}</p>
      </div>
    )
  }
  const err = state.status === 'error' ? state.fields : undefined

  return (
    <form action={action} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="ts" value={ts} />
      {/* honeypot: real visitors never see or fill this */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-name" className="mono">{labels.name}</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={100} className={field}
          aria-invalid={Boolean(err?.name)} aria-describedby={err?.name ? 'cf-name-err' : undefined} />
        {err?.name && <p id="cf-name-err" className="text-sm text-white">{err.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-email" className="mono">{labels.email}</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={200} className={field}
          aria-invalid={Boolean(err?.email)} aria-describedby={err?.email ? 'cf-email-err' : undefined} />
        {err?.email && <p id="cf-email-err" className="text-sm text-white">{err.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-topic" className="mono">{labels.topic}</label>
        <select id="cf-topic" name="topic" defaultValue="sponsorship" className={`${field} [&>option]:bg-black`}>
          {(Object.keys(labels.topics) as (keyof Labels['topics'])[]).map((k) => (
            <option key={k} value={k}>{labels.topics[k]}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-message" className="mono">{labels.message}</label>
        <textarea id="cf-message" name="message" rows={5} required maxLength={4000} className={`${field} resize-y`}
          aria-invalid={Boolean(err?.message)} aria-describedby={err?.message ? 'cf-message-err' : undefined} />
        {err?.message && <p id="cf-message-err" className="text-sm text-white">{err.message}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending} className="disabled:opacity-60">
          {pending ? labels.sending : labels.send}
        </Button>
        <p role="alert" className="text-sm text-white">{state.status === 'error' ? state.message : ''}</p>
      </div>
    </form>
  )
}
