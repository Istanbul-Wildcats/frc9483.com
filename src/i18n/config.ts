export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'tr'

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)

/** Route keys that have an editable entry in the Pages collection. */
export const pageSlugs = [
  'home', 'about', 'robots', 'awards', 'sponsors', 'join', 'contact', 'blog', 'resources', 'gallery', 'shop',
] as const
export type PageSlug = (typeof pageSlugs)[number]

/**
 * Fallback UI strings. The "Arayüz metinleri" global in Payload overrides any of these;
 * an empty field falls back to the value here.
 */
export const uiDefaults = {
  tr: {
    join: 'Takıma katıl', joinTeam: 'Takıma katıl', apply: 'Başvur', robots: 'Robotlar',
    detail: 'İncele', allAwards: 'Tüm başarılarımız', allSponsors: 'Tüm sponsorlarımız',
    achievements: 'Başarılar', sponsors: 'Sponsorlarımız', seasonSummary: 'Sezon özeti',
    seasonAwards: 'Sezon ödülleri', highlights: 'Öne çıkan videolar', videosLabel: 'Videolar', playVideo: "YouTube'da izle", back: 'Robotlar', notFoundBack: 'Ana sayfaya dön',
    writeUs: 'Bize ulaş', sponsorCta: 'Takımımıza sponsor olmak ister misin?',
    activeSponsors: 'Aktif sponsorlarımız', pastSponsors: 'Geçmiş sponsorlarımız', openForm: 'Formu aç', rankings: 'Sezona göre sıralama',
    teams: 'Takımda hangi ekipler çalışıyor?', who: 'Biz kimiz?', team: 'Takım', contact: 'İletişim',
    joinIntro: 'Takıma katılmak için başvuru formunu doldur.',
    contactIntro: 'Sponsorluk, iş birliği ya da takıma katılmak için yaz.',
    notFoundTitle: 'Sayfa bulunamadı', newTab: 'yeni sekmede açılır', menu: 'Menü', closeMenu: 'Menüyü kapat', viewLarge: 'Büyük görüntüle', unitsSuffix: 'adet', soldOut: 'Tükendi', sources: 'Sezon kaynakları', sourceNote: 'sezonu verileri', tableEvent: 'Etkinlik', tableRank: 'Sıralama', tableRecord: 'Rekor (G-M-B)', tableTotal: 'Sezon toplamı', tableOf: 'takım içinde', noProducts: 'Şu anda mağazada ürün yok.', formName: 'Ad soyad', formEmail: 'E-posta', formTopic: 'Konu', topicSponsor: 'Sponsorluk', topicCollab: 'İş birliği', topicJoin: 'Takıma katılım', topicOther: 'Diğer', formMessage: 'Mesajın', formSend: 'Gönder', formSending: 'Gönderiliyor…', formSuccessTitle: 'Mesajın bize ulaştı', formSuccessText: 'En kısa sürede sana dönüş yapacağız.', errName: 'Adını yaz (en az 2 karakter).', errEmail: 'Geçerli bir e-posta adresi yaz.', errMessage: 'Mesajın en az 10 karakter olmalı.', errGeneric: 'Mesaj gönderilemedi. Biraz sonra tekrar dene.', close: 'Kapat', previous: 'Önceki fotoğraf', next: 'Sonraki fotoğraf', skipToContent: 'İçeriğe geç',
    joinClosed: 'Başvurular şu anda kapalı. Soruların için bize yazabilirsin.', formHint: "Google Forms'ta açılır · yeni sekme", orderNote: 'Sipariş ve duyurular için bize ulaş.', buildThread: 'Chief Delphi build thread',
    awardsNote: "Ödül adları FIRST'un resmi adlarıdır: Woodie Flowers — mentorluk, Innovation in Control — kontrol mühendisliği, Leadership — takım liderliği.",
    sponsorStats: "Overcharge'in rakamları", cadView: 'CAD görseli', offSeasonRobots: 'Off Season Robotları',
  },
  en: {
    join: 'Join the team', joinTeam: 'Join the team', apply: 'Apply', robots: 'Robots',
    detail: 'Details', allAwards: 'All achievements', allSponsors: 'All our sponsors',
    achievements: 'Achievements', sponsors: 'Our sponsors', seasonSummary: 'Season summary',
    seasonAwards: 'Season awards', highlights: 'Highlight videos', videosLabel: 'Videos', playVideo: 'Watch on YouTube', back: 'Robots', notFoundBack: 'Back to home',
    writeUs: 'Contact us', sponsorCta: 'Want to sponsor our team?',
    activeSponsors: 'Active sponsors', pastSponsors: 'Past sponsors', openForm: 'Open form', rankings: 'Ranking by season',
    teams: 'Which sub-teams work on the team?', who: 'Who are we?', team: 'Team', contact: 'Contact',
    joinIntro: 'Fill in the application form to join the team.',
    contactIntro: 'Write to us about sponsorship, collaboration or joining the team.',
    notFoundTitle: 'Page not found', newTab: 'opens in a new tab', menu: 'Menu', closeMenu: 'Close menu', viewLarge: 'View larger', unitsSuffix: 'in stock', soldOut: 'Sold out', sources: 'Season sources', sourceNote: 'season data', tableEvent: 'Event', tableRank: 'Rank', tableRecord: 'Record (W-L-T)', tableTotal: 'Season total', tableOf: 'teams', noProducts: 'There are no products in the shop right now.', formName: 'Full name', formEmail: 'Email', formTopic: 'Topic', topicSponsor: 'Sponsorship', topicCollab: 'Collaboration', topicJoin: 'Joining the team', topicOther: 'Other', formMessage: 'Your message', formSend: 'Send', formSending: 'Sending…', formSuccessTitle: 'Your message reached us', formSuccessText: 'We will get back to you soon.', errName: 'Enter your name (at least 2 characters).', errEmail: 'Enter a valid email address.', errMessage: 'Your message must be at least 10 characters.', errGeneric: 'The message could not be sent. Please try again shortly.', close: 'Close', previous: 'Previous photo', next: 'Next photo', skipToContent: 'Skip to content',
    joinClosed: 'Applications are currently closed. Write to us with any questions.', formHint: 'Google Forms · opens in a new tab', orderNote: 'For orders and announcements, contact us.', buildThread: 'Chief Delphi build thread',
    awardsNote: "Award names are FIRST's official names: Woodie Flowers — mentoring, Innovation in Control — controls engineering, Leadership — team leadership.",
    sponsorStats: "Overcharge's numbers", cadView: 'CAD render', offSeasonRobots: 'Off Season Robots',
  },
} as const satisfies Record<Locale, Record<string, string>>

export type UiKey = keyof (typeof uiDefaults)['tr']
export const uiKeys = Object.keys(uiDefaults.tr) as UiKey[]

/** Fallback page headings, used when a Pages entry has no heading. */
export const pageHeadingDefaults: Record<Locale, Record<PageSlug, string>> = {
  tr: { home: 'Ana sayfa', about: 'Hakkımızda', robots: 'Robotlar', awards: 'Ödüller', sponsors: 'Sponsorlarımız', join: 'Katıl', contact: 'İletişim', blog: 'Blog', resources: 'Kaynaklar', gallery: 'Galeri', shop: 'Mağaza' },
  en: { home: 'Home', about: 'About', robots: 'Robots', awards: 'Awards', sponsors: 'Sponsors', join: 'Join', contact: 'Contact', blog: 'Blog', resources: 'Resources', gallery: 'Gallery', shop: 'Shop' },
}
