import { NextResponse } from 'next/server'

import { global, mediaUrl } from '@/lib/payload'

/** Browsers request /favicon.ico regardless of <link rel="icon">; send them to the favicon set in Site Settings. */
export async function GET(req: Request) {
  const s = await global('site-settings', 'tr')
  const icon = mediaUrl(s.favicon) ?? mediaUrl(s.faviconLight)
  if (!icon) return new NextResponse(null, { status: 404 })
  return NextResponse.redirect(new URL(icon, req.url), 307)
}
