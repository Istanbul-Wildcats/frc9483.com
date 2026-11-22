'use server'

import { headers } from 'next/headers'

import { isLocale } from '@/i18n/config'

import { getT, payload } from './payload'

export type ContactState =
  | { status: 'idle' }
  | { status: 'ok' }
  | { status: 'error'; message?: string; fields?: Partial<Record<'name' | 'email' | 'message', string>> }

const TOPICS = ['sponsorship', 'collaboration', 'join', 'other'] as const

// Best-effort limiter (per server instance): 5 messages / 10 minutes / IP.
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const raw = String(form.get('locale') ?? 'tr')
  const locale = isLocale(raw) ? raw : 'tr'
  const d = await getT(locale)

  // Spam trap: the hidden field must stay empty. Timing-based bots are caught by the limiter below;
  // autofilled (under 2s) real submissions are accepted rather than silently dropped with a fake success.
  if (String(form.get('website') ?? '') !== '') return { status: 'ok' }

  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim()
  const message = String(form.get('message') ?? '').trim()
  const topicRaw = String(form.get('topic') ?? 'other')
  const topic = (TOPICS as readonly string[]).includes(topicRaw) ? (topicRaw as (typeof TOPICS)[number]) : 'other'

  const fields: Partial<Record<'name' | 'email' | 'message', string>> = {}
  if (name.length < 2 || name.length > 100) fields.name = d.errName
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) fields.email = d.errEmail
  if (message.length < 10 || message.length > 4000) fields.message = d.errMessage
  if (Object.keys(fields).length) return { status: 'error', fields }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (limited(ip)) return { status: 'error', message: d.errGeneric }

  try {
    await (await payload()).create({
      collection: 'contact-messages',
      data: { name, email, topic, message, locale },
      overrideAccess: true,
    })
    return { status: 'ok' }
  } catch {
    return { status: 'error', message: d.errGeneric }
  }
}
