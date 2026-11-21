/**
 * Fills the new Payload model (robots, sponsors, globals...) with the
 * data of the design + the current FRC Events page (frc-events.firstinspires.org/team/9483).
 * Idempotent: documents are matched by slug/name and updated in place (re-running overwrites
 * the fields it sets; Google Form URLs in site-settings are not touched).
 * Images come from ./seed-assets (exported from the Claude Design file); missing ones are skipped.
 *
 * Run: pnpm seed   (needs DATABASE_URL and PAYLOAD_SECRET in .env.local)
 */
import path from 'node:path'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { pageHeadingDefaults, pageSlugs, uiDefaults } from '../i18n/config'

type L = 'tr' | 'en'
const LOCALES: L[] = ['tr', 'en']

/** copies row ids of the already-written tr doc into the en payload so rows are updated, not recreated */
const mergeIds = (tr: any, en: any): any => {
  if (Array.isArray(en) && !en.some((row) => row && typeof row === 'object')) return en
  if (Array.isArray(en)) return en.map((row, i) => ({ ...mergeIds(tr?.[i], row), ...(tr?.[i]?.id ? { id: tr[i].id } : {}) }))
  if (en && typeof en === 'object' && tr && typeof tr === 'object') {
    return Object.fromEntries(Object.entries(en).map(([k, v]) => [k, mergeIds(tr[k], v)]))
  }
  return en
}

const strip = (v: unknown): any => {
  if (Array.isArray(v)) return v.map(strip)
  if (v && typeof v === 'object') {
    const o = v as Record<string, any>
    // keep relationship objects as ids
    if ('filename' in o && 'id' in o) return o.id
    return Object.fromEntries(Object.entries(o).filter(([k]) => !['createdAt', 'updatedAt', 'globalType'].includes(k)).map(([k, x]) => [k, strip(x)]))
  }
  return v
}

/** writes tr first, then en on top of the same rows */
async function upsert(
  payload: Payload,
  target: { collection: string; where: object } | { global: string },
  build: (l: L) => Record<string, unknown>,
) {
  let id: number | string | undefined
  if ('collection' in target) {
    const found = await payload.find({ collection: target.collection as any, where: target.where as any, limit: 1, locale: 'tr', depth: 0 })
    id = found.docs[0]?.id
  }
  const write = async (l: L, data: any) => {
    if ('global' in target) return payload.updateGlobal({ slug: target.global as any, data, locale: l, depth: 0 })
    if (id) return payload.update({ collection: target.collection as any, id, data, locale: l, depth: 0 })
    const doc = await payload.create({ collection: target.collection as any, data, locale: l, depth: 0 })
    id = doc.id
    return doc
  }
  const trData = build('tr')
  const tr: any = await write('tr', trData).catch((e) => { console.error('TR write failed', JSON.stringify(trData).slice(0, 600)); throw e })
  const enData = mergeIds(strip(tr), build('en'))
  await write('en', enData).catch((e) => { console.error('EN write failed', JSON.stringify(enData).slice(0, 600)); throw e })
}

const ASSETS = path.resolve(process.cwd(), 'seed-assets')
async function media(payload: Payload, file: string, alt: string, altEn: string): Promise<number | undefined> {
  try {
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1, depth: 0 })
    const id = (existing.docs[0]?.id ??
      (await payload.create({ collection: 'media', data: { alt }, locale: 'tr', filePath: path.join(ASSETS, file) })).id) as number
    await payload.update({ collection: 'media', id, data: { alt }, locale: 'tr' })
    await payload.update({ collection: 'media', id, data: { alt: altEn }, locale: 'en' })
    return id
  } catch {
    console.warn(`skip image ${file} (not found in seed-assets)`)
    return undefined
  }
}

const run = async () => {
  const payload = await getPayload({ config })
  const files: Record<string, [string, string, string]> = {
    mark: ['logo-mark.png', 'Takım 9483 logosu', 'Team 9483 logo'],
    iconWhite: ['icon-white.png', 'Takım 9483 simgesi', 'Team 9483 icon'],
    iconBlack: ['icon-black.png', 'Takım 9483 simgesi', 'Team 9483 icon'],
    hero: ['hero-lifting-robot.jpg', 'Takım robotu havaya kaldırıyor', 'Team lifting the robot'],
    enigma: ['enigma.jpg', 'Enigma robotu', 'Enigma robot'],
    tidehunter: ['tidehunter.jpg', 'Tidehunter robotu', 'Tidehunter robot'],
    snapfire: ['snapfire.jpg', 'Snapfire robotu', 'Snapfire robot'],
    driverStation: ['driver-station.jpg', 'Sürücü istasyonu ve takım üyeleri', 'The driver station and team members'],
    carry: ['robot-carry.jpg', 'Takım üyeleri 9483 robotunu sahada taşıyor', 'Team members carrying the 9483 robot on the field'],
    axa: ['logo-axa.png', 'AXA Sigorta', 'AXA Sigorta'],
    karaca: ['logo-karaca.png', 'Karaca', 'Karaca'],
    boeing: ['logo-boeing.png', 'Boeing', 'Boeing'],
    rtx: ['logo-rtx.png', 'RTX', 'RTX'],
    rockwell: ['logo-rockwell.png', 'Rockwell Automation', 'Rockwell Automation'],
    wildcats: ['logo-istanbul-wildcats.png', 'İstanbul Wildcats', 'İstanbul Wildcats'],
    wcp: ['logo-wcp.png', 'WCP', 'WCP'],
    kosi: ['logo-kosi-metal.png', 'Koşi Metal', 'Koşi Metal'],
    dijitalpark: ['logo-dijitalpark.png', 'Dijitalpark Teknokent', 'Dijitalpark Teknokent'],
    futurebright: ['logo-futurebright.png', 'Future Bright Group', 'Future Bright Group'],
    orjin: ['logo-orjin.png', 'Orjin Automotive', 'Orjin Automotive'],
    dowaksa: ['logo-dowaksa.png', 'DowAksa', 'DowAksa'],
    besmak: ['logo-besmak.png', 'Besmak', 'Besmak'],
    kaban: ['logo-kaban.png', 'Kaban', 'Kaban'],
    artCnc: ['logo-art-cnc.png', 'ART CNC', 'ART CNC'],
    drivers: ['drivers.jpg', 'Sürücü ekibi saha kenarında maçı izliyor', 'The drive team watching the match from the driver station'],
    ceremony: ['award-ceremony.jpg', 'Bayrağa sarılı takım üyesi kupayla', 'A team member draped in a flag with a trophy'],
    champions: ['team-champions.jpg', 'Takım robotu hep birlikte kaldırıyor', 'The team raising the robot together'],
    fieldGroup: ['team-field-group.jpg', 'Takım robotu havaya kaldırarak poz veriyor', 'The team posing while lifting the robot'],
    crowd: ['team-crowd.jpg', 'Sürücüler saha kenarında, arkadan', 'Drivers at the field, seen from behind'],
  }
  // photos exported from the team's Drive (resized in seed-assets/photo-<n>.jpg)
  const photoAlts: Record<number, [string, string]> = {
    15: ['Maç sahasında oyun topları arasında 9483 robotu', 'The 9483 robot among game pieces on the field'],
    35: ['Robotun başında takım üyeleri', 'Team members around the robot'],
    43: ['Pist kenarında 9483 robotu', 'The 9483 robot trackside'],
    92: ['FIRST afişi önünde takım fotoğrafı', 'Team photo in front of the FIRST banner'],
    95: ['Takım saha kenarında plan yapıyor', 'The team planning beside the field'],
    119: ['Robot sahaya taşınıyor', 'The robot on its way to the field'],
    120: ['Robot sahada oyun topları arasında', 'Robot on the field among game pieces'],
    131: ['9483 robotunun yakın çekimi', 'Close-up of the 9483 robot'],
    136: ['Robot maç sırasında', 'The robot during a match'],
    164: ['Robot taşınırken', 'Carrying the robot'],
    170: ['Sahada 9483 robotu, hakemler ve masalar', 'The 9483 robot on the field with referees and tables'],
    201: ['Kupa ve bayrakla kutlama', 'Celebrating with the trophy and flag'],
    208: ['Takım sahada kupalar ve robotla poz veriyor', 'Team posing with trophies and the robot at the field'],
    209: ['FIRST Robotics Competition Winner bayrağı', 'FIRST Robotics Competition Winner banner'],
    214: ['Takım üyeleri madalyalar ve robotla', 'Team members with medals and the robot'],
    215: ['Takım pistte bir arada', 'The team gathered at the field'],
    224: ['Robot üzerinde çalışan takım', 'The team working on the robot'],
    226: ['Robot sahada taşınıyor', 'Carrying the robot on the field'],
    230: ['Takım üyeleri cam kafesli sahanın yanında', 'Team members beside the glass-walled field'],
    237: ['9483 robotu yakın çekim', 'Close-up of the 9483 robot'],
    239: ['9483 robotunun yakın çekimi', 'Close-up of the 9483 robot'],
    240: ['Takım üyeleri pit alanında bir arada', 'Team members together in the pit area'],
    242: ['Wildcats standında plan üzerinde çalışan iki takım üyesi', 'Two team members working over a plan at the Wildcats pit'],
    247: ['Sahada 9483 robotu, yukarıdan görünüm', 'The 9483 robot on the field, seen from above'],
    258: ['Pit alanında robot ve takım', 'Robot and team in the pit'],
    262: ['Robot kontrolü', 'Checking the robot'],
    266: ['Wildcats 9483 pit panosu', 'Wildcats 9483 pit banner'],
    267: ['Dizüstü bilgisayarla robot ayarı', 'Tuning the robot with a laptop'],
    277: ['Pit alanında robot üzerinde çalışma', 'Working on the robot in the pit'],
    174: ['Oyun topları arasında 9483 robotu, yandan görünüm', 'The 9483 robot among game pieces, side view'],
    220: ['Takım üyesi robotun mekanizmasını inceliyor', 'A team member inspecting the robot mechanism'],
    218: ['Takım sahada robotu hazırlıyor', 'The team preparing the robot at the field'],
    219: ['Takım üyeleri pitte robot üzerinde birlikte çalışıyor', 'Team members working on the robot together in the pit'],
    217: ['Takım üyeleri maçı heyecanla izliyor', 'Team members watching the match intently'],
    // used as the two-photo strips at the bottom of Home and About
    154: ['Sahada oyun topları arasında 9483 robotu', 'The 9483 robot among game pieces'],
    108: ['Saha kenarında 9483 robotu', 'The 9483 robot beside the field wall'],
    90: ['FIRST afişi önünde takım', 'The team in front of the FIRST banner'],
    236: ['Takım ve robot', 'The team and the robot'],
  }
  for (const [n, [tr, en]] of Object.entries(photoAlts)) files[`p${n}`] = [`photo-${n}.jpg`, tr, en]
  const img: Record<string, number | undefined> = {}
  for (const [k, [file, alt, altEn]] of Object.entries(files)) img[k] = await media(payload, file, alt, altEn)
  const ids = (...keys: string[]) => keys.map((k) => img[k]).filter((v): v is number => v !== undefined)
  const team = img.hero

  // ---- Robots (awards: frc-events.firstinspires.org/team/9483) ----
  const robots = [
    {
      videos: [['PG1N4AD15CM', 'Temiz robot videosu · Johnson Q35', 'Clean robot video · Johnson Q35'], ['tOYFbRIJ8CA', 'Bump + HP otonomu', 'Bump + HP auto'], ['t_CEsoxMZCQ', 'Robonauts antrenman maçı', 'Robonauts practice match']], slug: 'enigma', name: 'Enigma', season: 2026, game: 'Rebuilt', image: img.enigma, seasonPhoto: img.p136,
      awards: [
        ['Istanbul Regional', 'Istanbul Regional', 'FIRST Leadership Award Finalist', 'Liderlik Ödülü Finalisti'],
        ['Istanbul Regional', 'Istanbul Regional', 'Industrial Design Award', 'Endüstriyel Tasarım Ödülü'],
        ['Istanbul Regional', 'Istanbul Regional', 'Regional Winners', 'Regional Winner'],
        ['Istanbul Regional', 'Istanbul Regional', 'Woodie Flowers Finalist Award', 'Woodie Flowers Finalisti'],
        ['Avrasya Regional', 'Avrasya Regional', 'Innovation in Control Award (nVent)', 'İnovasyon ve Kontrol Ödülü (nVent)'],
        ['Avrasya Regional', 'Avrasya Regional', 'Regional Winners', 'Regional Winner'],
      ],
      events: [{ en: 'Istanbul Regional', tr: 'Istanbul Regional', rank: 1, teams: 32, w: 12, l: 0, t: 0, resEn: 'Regional Winners', resTr: 'Regional şampiyonu' }, { en: 'Avrasya Regional', tr: 'Avrasya Regional', rank: 1, teams: 40, w: 8, l: 0, t: 0, resEn: 'Regional Winners', resTr: 'Regional şampiyonu' }, { en: 'Johnson Division', tr: 'Johnson Division', rank: 11, teams: 75, w: 7, l: 3, t: 0, resEn: '', resTr: '' }],
    },
    {
      videos: [['o99StVtb6NM', 'Temiz robot videosu · Galileo Q92', 'Clean robot video · Galileo Q92'], ['a7SIaqHtu7k', '4 L4 + 3 Algae otonomu', '4 L4 + 3 Algae auto'], ['P6JnrWzIK8M', '4 L4 + 3 Algae otonomu (sansürsüz)', '4 L4 + 3 Algae auto (uncensored)'], ['MuF_vgHYVhk', 'Behind the Bumpers', 'Behind the Bumpers']], slug: 'tidehunter', name: 'Tidehunter', season: 2025, game: 'Reefscape', image: img.tidehunter, seasonPhoto: img.crowd,
      awards: [
        ['Bosphorus Regional', 'Bosphorus Regional', 'Autonomous Award', 'Otonom Ödülü'],
        ['Bosphorus Regional', 'Bosphorus Regional', 'Regional Winners', 'Regional Winner'],
        ['Marmara Regional', 'Marmara Regional', 'Innovation in Control Award (nVent)', 'İnovasyon ve Kontrol Ödülü (nVent)'],
        ['Marmara Regional', 'Marmara Regional', 'Regional Finalists', 'Regional Finalist'],
      ],
      events: [{ en: 'Bosphorus Regional', tr: 'Bosphorus Regional', rank: 1, teams: 48, w: 9, l: 0, t: 0, resEn: 'Regional Winners', resTr: 'Regional şampiyonu' }, { en: 'Marmara Regional', tr: 'Marmara Regional', rank: 2, teams: 50, w: 7, l: 1, t: 0, resEn: 'Regional Finalists', resTr: 'Regional finalisti' }, { en: 'Galileo Division', tr: 'Galileo Division', rank: 2, teams: 75, w: 9, l: 1, t: 0, resEn: '', resTr: '' }],
    },
    {
      videos: [['YVTp38deSOQ', 'Temiz robot videosu', 'Clean robot video'], ['gJhbDuOYNgo', '7,5 Note otonomu', '7.5 Note auto'], ['8yha1qAHkDs', '7,5 Note otonomu (sansürsüz)', '7.5 Note auto (uncensored)'], ['QSppnOxWbDg', 'Robot POV · Milstein Q67', 'Robot POV · Milstein Q67'], ['jjyVmi1RW9k', 'Robot POV · Milstein Q92', 'Robot POV · Milstein Q92'], ['GaLm00wcnVE', 'Behind the Bumpers', 'Behind the Bumpers']], slug: 'snapfire', name: 'Snapfire', season: 2024, game: 'Crescendo', image: img.snapfire, seasonPhoto: img.p214,
      awards: [
        ['Milstein Division', 'Milstein Division', 'Championship Division Winner', 'Championship Division Winner'],
        ['Marmara Regional', 'Marmara Regional', 'Autonomous Award', 'Otonom Ödülü'],
        ['Marmara Regional', 'Marmara Regional', 'Regional Winners', 'Regional Winner'],
        ['Bosphorus Regional', 'Bosphorus Regional', 'Innovation in Control Award', 'İnovasyon ve Kontrol Ödülü'],
        ['Bosphorus Regional', 'Bosphorus Regional', 'Regional Winners', 'Regional Winner'],
      ],
      events: [{ en: 'Bosphorus Regional', tr: 'Bosphorus Regional', rank: 7, teams: 51, w: 6, l: 3, t: 0, resEn: 'Regional Winners', resTr: 'Regional şampiyonu' }, { en: 'Marmara Regional', tr: 'Marmara Regional', rank: 1, teams: 53, w: 7, l: 2, t: 0, resEn: 'Regional Winners', resTr: 'Regional şampiyonu' }, { en: 'Milstein Division', tr: 'Milstein Division', rank: 9, teams: 75, w: 8, l: 2, t: 0, resEn: 'Division Winner', resTr: 'Division şampiyonu' }],
    },
  ]
  for (const r of robots) {
    await upsert(payload, { collection: 'robots', where: { slug: { equals: r.slug } } }, (l) => ({
      name: r.name, slug: r.slug, season: r.season, game: r.game, image: r.image, seasonPhoto: r.seasonPhoto,
      events: r.events.map((e) => ({
        event: l === 'tr' ? e.tr : e.en, rank: e.rank, teams: e.teams, wins: e.w, losses: e.l, ties: e.t,
        result: (l === 'tr' ? e.resTr : e.resEn) || undefined,
      })),
      awards: r.awards.map(([ee, et, ae, at]) => ({ event: l === 'tr' ? et : ee, title: ae, banner: /Winner|Woodie Flowers Finalist/.test(ae) })),
      videos: r.videos.map(([id, tr, en]) => ({ url: `https://youtu.be/${id}`, title: l === 'tr' ? tr : en })),
      links: {
        tba: `https://www.thebluealliance.com/team/9483/${r.season}`,
        statbotics: `https://www.statbotics.io/team/9483/${r.season}`,
        firstEvents: `https://frc-events.firstinspires.org/${r.season}/team/9483`,
      },
    }))
  }

  // ---- Sponsors: active first (2026 list), then past sponsors without years ----
  const sponsors: { name: string; legalName?: string; logo?: number; status: 'active' | 'past' }[] = [
    { name: 'Boeing', legalName: 'The Boeing Company', logo: img.boeing, status: 'active' },
    { name: 'Dijitalpark Teknokent', logo: img.dijitalpark, status: 'active' },
    { name: 'RTX', legalName: 'RTX Corporation', logo: img.rtx, status: 'active' },
    { name: 'Future Bright Group', logo: img.futurebright, status: 'active' },
    { name: 'Karaca', logo: img.karaca, status: 'active' },
    { name: 'AXA Sigorta', legalName: 'AXA Sigorta A.Ş.', logo: img.axa, status: 'active' },
    { name: 'ART CNC', logo: img.artCnc, status: 'active' },
    { name: 'WCP', legalName: 'West Coast Products', logo: img.wcp, status: 'active' },
    { name: 'Koşi Metal', logo: img.kosi, status: 'active' },
    { name: 'İstanbul Wildcats', legalName: 'Denizbank İstanbul Wildcats', logo: img.wildcats, status: 'past' },
    { name: 'Rockwell Automation', legalName: 'Rockwell Automation, Inc.', logo: img.rockwell, status: 'past' },
    { name: 'Orjin Automotive', legalName: 'Orjin Otomotiv Sanayi ve Ticaret A.Ş.', logo: img.orjin, status: 'past' },
    { name: 'DowAksa', legalName: 'DowAksa İleri Kompozit Malzemeler Sanayi Limited Şirketi', logo: img.dowaksa, status: 'past' },
    { name: 'Besmak', legalName: 'Besmak Laboratuvar ve İnşaat Test Makinaları San. ve Tic. Ltd. Şti.', logo: img.besmak, status: 'past' },
    { name: 'Kaban', legalName: 'Kaban Makina Sanayi ve Ticaret Limited Şirketi', logo: img.kaban, status: 'past' },
  ]
  await payload.delete({ collection: 'sponsors', where: { name: { in: ['Dijital Park Teknokent', 'Koşi Metal', 'Dowsea'] } } })
  for (const [i, s] of sponsors.entries()) {
    await upsert(payload, { collection: 'sponsors', where: { name: { equals: s.name } } }, () => ({ ...s, order: (i + 1) * 10 }))
  }

  // ---- Gallery ----
  const designGallery: [string, string, string][] = [
    ['drivers', 'Sürücü ekibi saha kenarında maçı izliyor', 'The drive team watching the match from the driver station'],
    ['ceremony', 'Bayrağa sarılı takım üyesi kupayla', 'A team member draped in a flag with a trophy'],
    ['carry', 'Takım üyeleri 9483 robotunu sahada taşıyor', 'Team members carrying the 9483 robot on the field'],
    ['fieldGroup', 'Takım robotu havaya kaldırarak poz veriyor', 'The team posing while lifting the robot'],
  ]
  const strips = new Set([154, 108, 90, 236, 136, 214, 208]) // 154/108/90/236: Home + About strips; 136/214: Awards; 208: About hero // already shown at the bottom of Home / About
  const photos = Object.keys(photoAlts).map(Number).filter((n) => !strips.has(n)).map((n): [string, string, string] => [`p${n}`, photoAlts[n][0], photoAlts[n][1]])
  // one design photo after every three new ones, so the grid does not clump
  const gallery: [string, string, string][] = []
  const rest = [...designGallery]
  photos.forEach((p, i) => { gallery.push(p); if ((i + 1) % 3 === 0 && rest.length) gallery.push(rest.shift()!) })
  gallery.push(...rest)
  for (const [i, [key, caption, captionEn]] of gallery.entries()) {
    if (img[key] === undefined) continue
    await upsert(payload, { collection: 'gallery-images', where: { image: { equals: img[key] } } }, (l) => ({ image: img[key], caption: l === 'tr' ? caption : captionEn, order: (i + 1) * 10 }))
  }

  // ---- Globals ----
  await upsert(payload, { global: 'home' }, (l) => ({
    heroImage: team, sideImage: img.driverStation, pairImages: ids('p154', 'p108'), heroTitle: 'Overcharge', heroTag: '#9483',
    highlights: [
      ['2024', 'Milstein Division şampiyonu', 'Milstein Division champions'],
      ['2024', 'Marmara Regional şampiyonu', 'Marmara Regional winners'],
      ['2024', 'Bosphorus Regional şampiyonu', 'Bosphorus Regional winners'],
      ['2025', 'Bosphorus Regional şampiyonu', 'Bosphorus Regional winners'],
      ['2026', 'İstanbul Regional şampiyonu', 'İstanbul Regional winners'],
      ['2026', 'Avrasya Regional şampiyonu', 'Avrasya Regional winners'],
    ].map(([year, tr, en]) => ({ year, title: l === 'tr' ? tr : en })),
    ctaText: l === 'tr' ? 'Takımımıza katılmak ister misin?' : 'Want to join our team?',
  }))

  await upsert(payload, { global: 'about' }, (l) => ({
    heroImage: img.p208,
    whoImage: img.champions,
    pairImages: ids('p90', 'p236'),
    lead: l === 'tr'
      ? "Overcharge, sınırları aşan bir topluluk: sınırları olanaklara dönüştüren, Türkiye'nin mühendislik potansiyelini dünyaya taşıyan öğrenciler."
      : "Overcharge is a community that goes beyond limits: students who turn limits into possibilities and carry Türkiye's engineering potential to the world.",
    paragraphs: (l === 'tr'
      ? ['Sınırların kendiliğinden kalkmasını beklemiyoruz. Onları kırıyoruz. Türkiye\'den dünyaya, mühendislik yoluyla sınırları kırıyoruz.', 'En üst düzeyde yarışmakla yetinmiyoruz; Türkiye robotiğinde en üst düzeyin neye benzediğini yeniden tanımlamaya yardımcı oluyoruz.']
      : ['We do not wait for limits to disappear on their own. We break them. From Türkiye to the world, we break limits through engineering.', 'We are not satisfied with competing at the highest level; we help redefine what the highest level looks like in Turkish robotics.']
    ).map((text) => ({ text })),
    tagline: l === 'tr' ? 'Sınırların ötesi, robotikte başlıyor.' : 'Beyond limits begins in robotics.',
    stats: [
      ['15', 'Toplam ödül', 'Total awards'],
      ['6', 'Winner unvanı (5 Regional, 1 Division)', 'Winner titles (5 Regional, 1 Division)'],
      ['3', 'FIRST Championship', 'FIRST Championship trips'],
      ['11', 'Katıldığımız etkinlik', 'Events competed'],
    ].map(([value, tr, en]) => ({ value, label: l === 'tr' ? tr : en })),
    rankings: [
      ['2024', 'Snapfire', 'Milstein Division şampiyonu', 'Milstein Division winner'],
      ['2025', 'Tidehunter', 'Galileo Division', 'Galileo Division'],
      ['2026', 'Enigma', 'İstanbul ve Avrasya şampiyonu, Johnson Division', 'İstanbul and Avrasya winners, Johnson Division'],
    ].map(([year, title, tr, en]) => ({ year, title, result: l === 'tr' ? tr : en })),
    teams: (l === 'tr' ? ['Mekanik', 'Yazılım', 'Elektronik', 'Proje ve Sponsorluk'] : ['Mechanical', 'Software', 'Electronics', 'Project and Sponsorship']).map((name) => ({ name })),
  }))

  await upsert(payload, { global: 'navigation' }, (l) => ({
    logo: img.mark,
    links: [
      ['/about', 'Hakkımızda', 'About'], ['/robots', 'Robotlar', 'Robots'], ['/awards', 'Ödüller', 'Awards'],
      ['/blog', 'Blog', 'Blog'], ['/gallery', 'Galeri', 'Gallery'], ['/shop', 'Mağaza', 'Shop'],
      ['/sponsors', 'Sponsorlar', 'Sponsors'], ['/resources', 'Kaynaklar', 'Resources'], ['/contact', 'İletişim', 'Contact'],
    ].map(([href, tr, en]) => ({ href, label: l === 'tr' ? tr : en })),
  }))

  await upsert(payload, { global: 'resources' }, () => ({
    links: [
      { label: 'FIRST', url: 'https://www.firstinspires.org' },
      { label: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/9483' },
      { label: 'FRC Events · 9483', url: 'https://frc-events.firstinspires.org/team/9483' },
      { label: 'Statbotics', url: 'https://www.statbotics.io/team/9483' },
    ],
  }))

  // ---- Pages: heading / intro / SEO for every route ----
  const seoCopy: Record<(typeof pageSlugs)[number], [string, string]> = {
    home: ['FIRST Robotics Competition takımı Overcharge (9483). İstanbul\'dan 2024 Milstein Division şampiyonu.', 'Overcharge (9483), a FIRST Robotics Competition team from Istanbul. 2024 Milstein Division winners.'],
    about: ['Overcharge\'in hikâyesi, hedefleri, sezon sonuçları ve takımdaki ekipler.', 'The story, goals, season results and sub-teams of Overcharge.'],
    robots: ['Overcharge\'in 2024, 2025 ve 2026 sezonlarında yarışan robotları: Snapfire, Tidehunter ve Enigma.', 'The robots Overcharge competed with in 2024, 2025 and 2026: Snapfire, Tidehunter and Enigma.'],
    awards: ['Overcharge\'in bölgesel ve championship ödülleri, sezon sezon.', 'Overcharge regional and championship awards, season by season.'],
    sponsors: ['Overcharge\'i destekleyen sponsorlar ve sponsor olmak için iletişim.', 'The sponsors supporting Overcharge, and how to become one.'],
    join: ['Overcharge robotik takımına katılmak için başvuru bilgileri.', 'How to apply to join the Overcharge robotics team.'],
    contact: ['Sponsorluk, iş birliği ve takıma katılım için Overcharge ile iletişime geç.', 'Contact Overcharge about sponsorship, collaboration or joining the team.'],
    blog: ['Overcharge takımından haberler ve yazılar.', 'News and posts from the Overcharge team.'],
    resources: ['FIRST, The Blue Alliance ve takım hakkında yararlı bağlantılar.', 'Useful links about FIRST, The Blue Alliance and the team.'],
    gallery: ['Overcharge\'in yarışma, atölye ve ödül töreni fotoğrafları.', 'Photos of Overcharge at competitions, in the workshop and at award ceremonies.'],
    shop: ['Overcharge takım ürünleri.', 'Overcharge team merchandise.'],
  }
  for (const slug of pageSlugs) {
    await upsert(payload, { collection: 'pages', where: { slug: { equals: slug } } }, (l) => ({
      slug,
      title: pageHeadingDefaults[l][slug],
      heading: pageHeadingDefaults[l][slug],
      ...(slug === 'join' ? { intro: uiDefaults[l].joinIntro } : {}),
      ...(slug === 'contact' ? { intro: uiDefaults[l].contactIntro } : {}),
      seo: { description: seoCopy[slug][l === 'tr' ? 0 : 1], image: team },
    }))
  }

  await upsert(payload, { global: 'ui-text' }, (l) => ({ ...uiDefaults[l] }))

  await upsert(payload, { global: 'site-settings' }, (l) => ({
    teamName: 'FRC 9483 Overcharge',
    siteName: 'Overcharge · FRC 9483',
    description: l === 'tr'
      ? 'Overcharge (9483), İstanbul merkezli FIRST Robotics Competition takımı.'
      : 'Overcharge (9483) is a FIRST Robotics Competition team based in Istanbul.',
    ogImage: team,
    favicon: img.iconWhite,
    faviconLight: img.iconBlack,
    footerTitle: 'OVERCHARGE',
    footerSubtitle: '#9483 · İstanbul',
    email: 'hello@frc9483.com',
    forms: { joinUrl: 'https://forms.gle/NSCkiAk91CJ4EBSm6' },
    socials: [
      { label: 'Instagram', url: 'https://www.instagram.com/frc9483' },
      { label: 'YouTube', url: 'https://www.youtube.com/@frc9483' },
      { label: 'The Blue Alliance', url: 'https://www.thebluealliance.com/team/9483' },
      { label: 'Statbotics', url: 'https://www.statbotics.io/team/9483' },
    ],
  }))

  console.log('site seed done')
  process.exit(0)
}

run().catch((e) => {
  console.error(e?.message ?? e, e?.data ? JSON.stringify(e.data.errors ?? e.data) : '')
  process.exit(1)
})
