/**
 * TEMPORARY one-off (removed in the next commit): uploads the new About photo and the 9483 logo
 * into the production media library and points the About pair image, the nav logo and the favicons at them.
 * Run once:  GET /api/apply-assets?key=<KEY>
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import { processImage } from '@/lib/image-processing'

import teamPhoto from '@/seed-tmp/team-milstein-2024.png'
import logoSrc from '@/seed-tmp/logo-9483.png'

const KEY = 'b138b5a14857a8a2ede7bd543c564c63'
type L = 'tr' | 'en'

async function upsertMedia(payload: Payload, name: string, data: Buffer, alt: Record<L, string>) {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: { alt: alt.tr },
    file: { name, mimetype: 'image/png', size: data.byteLength, data },
    locale: 'tr',
  })
  await payload.update({ collection: 'media', id: doc.id, data: { alt: alt.en }, locale: 'en' })
  return doc.id as number
}

const load = async (src: string, origin: string) => Buffer.from(await (await fetch(new URL(src, origin))).arrayBuffer())

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get('key') !== KEY) return new Response('not found', { status: 404 })
  const payload = await getPayload({ config: (await import('@payload-config')).default })
  const origin = new URL(req.url).origin

  const photo = await upsertMedia(payload, 'team-milstein-2024.png', await load(teamPhoto.src, origin), {
    tr: 'Takım, Milstein Division şampiyonluğu bayrağıyla Houston’da', en: 'The team with the Milstein Division winner banner in Houston',
  })
  const logoBuf = await load(logoSrc.src, origin)
  // square original for the favicons; trimmed white-on-transparent version for the nav bar
  const logoSquare = await upsertMedia(payload, 'logo-9483.png', logoBuf, { tr: '9483 logosu', en: '9483 logo' })
  const logoNav = await upsertMedia(payload, 'logo-9483-nav.png', await processImage.logo(logoBuf), { tr: '9483 logosu', en: '9483 logo' })

  const about = await payload.findGlobal({ slug: 'about', depth: 0 })
  const pair = (about.pairImages ?? []).map((m) => (typeof m === 'object' ? m.id : m))
  const rest = pair.slice(1, 2)
  await payload.updateGlobal({ slug: 'about', depth: 0, data: { pairImages: [photo, ...rest] } })
  await payload.updateGlobal({ slug: 'navigation', depth: 0, data: { logo: logoNav } })
  await payload.updateGlobal({ slug: 'site-settings', depth: 0, data: { favicon: logoSquare, faviconLight: logoSquare } })
  return Response.json({ ok: true, photo, logoSquare, logoNav, aboutPairBefore: pair, aboutPairAfter: [photo, ...rest] })
}
