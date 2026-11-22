/**
 * TEMPORARY one-off: marks Ballista as an off-season robot in the production DB
 * (runs inside the Vercel deployment where the secrets exist). Run once:
 * GET /api/flag-offseason?key=<KEY> — then DELETE this file.
 */
import { getPayload } from 'payload'

const KEY = 'd70f0773afe8eafa6901cff26c4ef0bc'

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get('key') !== KEY) return new Response('not found', { status: 404 })
  const payload = await getPayload({ config: (await import('@payload-config')).default })
  const res = await payload.update({ collection: 'robots', where: { slug: { equals: 'ballista' } }, data: { offSeason: true }, depth: 0 })
  return Response.json({ ok: true, updated: res.docs?.length ?? 0 })
}
