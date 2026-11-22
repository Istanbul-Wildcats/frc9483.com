/**
 * TEMPORARY one-off: writes the Ballista robot into the production database
 * (this runs inside the Vercel deployment where the real secrets exist, unlike
 * the local seed that pointed at the localhost database).
 * Run once:  GET /api/seed-ballista?key=<KEY>   — then DELETE this file.
 */
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import type { Robot } from '@/payload-types'

import ballistaCad from '@/assets/seed/ballista-cad.png'
import ballistaPhoto from '@/assets/seed/ballista.jpg'

const KEY = 'd70f0773afe8eafa6901cff26c4ef0bc'

type L = 'tr' | 'en'
const VIDEOS: [string, string, string][] = [
  ['ZJKFeZ1GG5o', 'Build blog videosu 1', 'Build blog video 1'],
  ['qvgolT8bLL0', 'Build blog videosu 2', 'Build blog video 2'],
]

async function upsertMedia(payload: Payload, file: { name: string; src: string; mimetype: string; alt: Record<L, string> }, origin: string) {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: file.name } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id as number
  const res = await fetch(new URL(file.src, origin))
  const data = Buffer.from(await res.arrayBuffer())
  const doc = await payload.create({
    collection: 'media',
    data: { alt: file.alt.tr },
    file: { name: file.name, mimetype: file.mimetype, size: data.byteLength, data },
    locale: 'tr',
  })
  await payload.update({ collection: 'media', id: doc.id, data: { alt: file.alt.en }, locale: 'en' })
  return doc.id as number
}

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get('key') !== KEY) return new Response('not found', { status: 404 })
  const payload = await getPayload({ config: (await import('@payload-config')).default })
  const origin = new URL(req.url).origin
  const image = await upsertMedia(payload, { name: 'ballista.jpg', src: ballistaPhoto.src, mimetype: 'image/jpeg', alt: { tr: 'Ballista robotu', en: 'Ballista robot' } }, origin)
  const cadImage = await upsertMedia(payload, { name: 'ballista-cad.png', src: ballistaCad.src, mimetype: 'image/png', alt: { tr: 'Ballista CAD görseli', en: 'Ballista CAD render' } }, origin)

  const base = {
    name: 'Ballista', slug: 'ballista', season: 2023, game: 'Charged Up', image, cadImage,
    awards: [],
    links: {
      tba: 'https://www.thebluealliance.com/team/9483/2023',
      statbotics: 'https://www.statbotics.io/team/9483/2023',
      firstEvents: 'https://frc-events.firstinspires.org/2023/team/9483',
      chiefDelphi: 'https://www.chiefdelphi.com/t/besiktas-rsports-9483-2023-off-season-build-blog/440340',
      chiefDelphiTitle: '2023 Off-Season Build Blog',
    },
  }
  const build = (l: L, rowIds?: { events?: (string | number)[]; videos?: (string | number)[] }) => ({
    ...base,
    events: [{ event: l === 'tr' ? 'Esenler Robotik Yarışması' : 'Esenler Robotics Competition', ...(rowIds?.events?.length ? { id: rowIds.events[0] } : {}) }],
    videos: VIDEOS.map(([id, tr, en], i) => ({ url: `https://youtu.be/${id}`, title: l === 'tr' ? tr : en, ...(rowIds?.videos?.[i] ? { id: rowIds.videos[i] } : {}) })),
  })

  const found = await payload.find({ collection: 'robots', where: { slug: { equals: 'ballista' } }, limit: 1, depth: 0, locale: 'tr' })
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let doc: any
  if (found.docs[0]) {
    doc = await payload.update({ collection: 'robots', id: found.docs[0].id, data: build('tr') as any, locale: 'tr', depth: 0 })
  } else {
    doc = await payload.create({ collection: 'robots', data: build('tr') as any, locale: 'tr', depth: 0 })
  }
  const trDoc = (await payload.findByID({ collection: 'robots', id: doc.id, locale: 'tr', depth: 0 })) as Robot
  await payload.update({
    collection: 'robots',
    id: doc.id,
    locale: 'en',
    depth: 0,
    data: build('en', { events: (trDoc.events ?? []).map((e) => e.id as string), videos: (trDoc.videos ?? []).map((v) => v.id as string) }) as any,
  })
  return Response.json({ ok: true, id: doc.id, image, cadImage })
}
