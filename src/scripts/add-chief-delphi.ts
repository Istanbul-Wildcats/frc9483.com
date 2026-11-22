/** One-off: set the Chief Delphi build-thread links on robots, and the two team-story links on the resources global. Run: npx tsx --env-file=.env.local src/scripts/add-chief-delphi.ts */
import config from '@payload-config'
import { getPayload } from 'payload'

const CD: Record<string, { url: string; title: string }> = {
  enigma: { url: 'https://www.chiefdelphi.com/t/team-9483-presents-enigma/515383', title: 'Team 9483 Presents: Enigma' },
  tidehunter: { url: 'https://www.chiefdelphi.com/t/team-9483-presents-tidehunter/494097', title: 'Team 9483 Presents: Tidehunter' },
  snapfire: { url: 'https://www.chiefdelphi.com/t/team-9483-presents-snapfire/457771', title: 'Team 9483 Presents: Snapfire' },
}

const payload = await getPayload({ config })

for (const [slug, cd] of Object.entries(CD)) {
  const robots = await payload.find({ collection: 'robots', where: { slug: { equals: slug } }, limit: 1 })
  const r = robots.docs[0]
  if (!r) { console.error(`robot ${slug} not found`); continue }
  await payload.update({
    collection: 'robots',
    id: r.id,
    data: { links: { ...(r.links ?? {}), chiefDelphi: cd.url, chiefDelphiTitle: cd.title } },
  })
}

const RESOURCES_EXTRA = {
  tr: [
    { label: '9483 Scouting Saga: From Vibes and Paper to Predictive Data', url: 'https://www.chiefdelphi.com/t/9483-scouting-saga-from-vibes-and-paper-to-predictive-data/521985', description: '2026 izcilik sistemimiz: sezgidan tahmine dayalı veriye.' },
    { label: '2023 Off-Season Build Blog', url: 'https://www.chiefdelphi.com/t/besiktas-rsports-9483-2023-off-season-build-blog/440340', description: 'Beşiktaş Rsports dönemindeki 2023 sezon dışı build blogu.' },
  ],
  en: [
    { label: '9483 Scouting Saga: From Vibes and Paper to Predictive Data', url: 'https://www.chiefdelphi.com/t/9483-scouting-saga-from-vibes-and-paper-to-predictive-data/521985', description: 'Our 2026 scouting system: from vibes and paper to predictive data.' },
    { label: '2023 Off-Season Build Blog', url: 'https://www.chiefdelphi.com/t/besiktas-rsports-9483-2023-off-season-build-blog/440340', description: 'The 2023 off-season build blog from the Beşiktaş Rsports era.' },
  ],
} as const

for (const locale of ['tr', 'en'] as const) {
  const g = await payload.findGlobal({ slug: 'resources', locale, depth: 0 })
  await payload.updateGlobal({ slug: 'resources', locale, data: { links: [...(g.links ?? []), ...RESOURCES_EXTRA[locale]] } })
}
console.log('chief delphi links + resources written')
process.exit(0)
