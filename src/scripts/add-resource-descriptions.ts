/** One-off: fill the resources global's new description fields in the live DB. Run: npx tsx --env-file=.env.local src/scripts/add-resource-descriptions.ts */
import config from '@payload-config'
import { getPayload } from 'payload'

const DESCRIPTIONS: Record<string, Partial<Record<'tr' | 'en', string>>> = {
  FIRST: { tr: "FRC'i düzenleyen organizasyon.", en: 'The organization that runs FRC.' },
  'The Blue Alliance': { tr: 'Takımın maç, sonuç ve ödül arşivi.', en: "The team's match, result and award archive." },
  'FRC Events · 9483': { tr: 'Resmi etkinlik sonuçları.', en: 'Official event results.' },
  Statbotics: { tr: 'Takım performans analizi (EPA, sıralamalar).', en: 'Team performance analytics (EPA, rankings).' },
} as const

const payload = await getPayload({ config })
for (const locale of ['tr', 'en'] as const) {
  const g = await payload.findGlobal({ slug: 'resources', locale, depth: 0 })
  if (!g.links?.length) continue
  await payload.updateGlobal({
    slug: 'resources',
    locale,
    data: { links: g.links.map((x) => ({ ...x, description: DESCRIPTIONS[x.label]?.[locale] ?? x.description ?? '' })) },  })
}
console.log('resources descriptions written')
process.exit(0)
