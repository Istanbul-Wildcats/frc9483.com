import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, locales } from '@/i18n/config'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return

  const cookie = req.cookies.get('locale')?.value
  const accept = req.headers.get('accept-language')?.toLowerCase() ?? ''
  const guess = cookie && isLocale(cookie) ? cookie : accept.startsWith('tr') ? 'tr' : accept ? 'en' : defaultLocale

  const url = req.nextUrl.clone()
  url.pathname = `/${guess}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\..*).*)'],
}
