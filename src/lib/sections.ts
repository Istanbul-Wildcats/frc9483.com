/**
 * Page sections the team can show or hide from the panel (Sayfalar → <sayfa> → "Bölümler").
 * One list drives the checkbox fields (collections/Pages.ts) and the page code (`getPage().show`).
 * The column names are frozen in migrations: renaming a key means a new migration.
 */
export const sectionToggles = [
  { key: 'homeRobots', page: 'home', label: 'Robotlarımız' },
  { key: 'homeAchievements', page: 'home', label: 'Başarılar' },
  { key: 'homePhotos', page: 'home', label: 'İkili fotoğraf bandı' },
  { key: 'homeSponsors', page: 'home', label: 'Sponsorlarımız' },
  { key: 'homeCta', page: 'home', label: 'Takıma katıl çağrısı' },
  { key: 'aboutStats', page: 'about', label: 'Rakamlar' },
  { key: 'aboutRankings', page: 'about', label: 'Sezona göre sıralama' },
  { key: 'aboutPhotos', page: 'about', label: 'İkili fotoğraf bandı' },
  { key: 'aboutTeams', page: 'about', label: 'Ekipler' },
  { key: 'robotsOffSeason', page: 'robots', label: 'Off Season robotları' },
  { key: 'awardsNote', page: 'awards', label: 'Ödül adları açıklaması' },
  { key: 'sponsorsPast', page: 'sponsors', label: 'Geçmiş sponsorlar' },
  { key: 'sponsorsCta', page: 'sponsors', label: 'Sponsor olma çağrısı' },
  { key: 'contactSocials', page: 'contact', label: 'Sosyal medya bağlantıları' },
] as const

export type SectionKey = (typeof sectionToggles)[number]['key']
