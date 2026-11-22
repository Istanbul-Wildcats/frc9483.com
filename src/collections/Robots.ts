import type { CollectionConfig } from 'payload'

export const Robots: CollectionConfig = {
  slug: 'robots',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'season', 'order'] },
  access: { read: () => true },
  defaultSort: '-season',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'season', type: 'number', required: true, admin: { description: 'Örn. 2026' } },
    { name: 'offSeason', type: 'checkbox', label: 'Sezon dışı', defaultValue: false, admin: { description: 'Sezon dışı (off-season) robotlar ana robot listesinde değil, ayrı "Sezon dışı robotlar" bölümünde görünür ve ana sayfada gösterilmez.' } },
    { name: 'game', type: 'text', admin: { description: 'Sezon oyunu, örn. Rebuilt' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Robotun ürün fotoğrafı (ana sayfa, robot listesi ve robot sayfası).' } },
    { name: 'seasonPhoto', type: 'upload', relationTo: 'media', label: 'Ödüller sayfası fotoğrafı', admin: { description: 'Ödüller sayfasında bu sezonun bölümünde görünen fotoğraf (robot ya da takım fotoğrafı).' } },
    { name: 'cadImage', type: 'upload', relationTo: 'media', admin: { description: 'Robotun CAD görseli; robot sayfasında ayrı bir bölümde görünür. Boşsa bölüm hiç gösterilmez.' } },
    {
      name: 'events',
      type: 'array',
      labels: { singular: 'Etkinlik', plural: 'Sezon tablosu (etkinlikler)' },
      admin: { description: 'Robot sayfasındaki sezon tablosu. FIRST Events sayfasındaki sıralama ve rekor değerleri.' },
      fields: [
        { name: 'event', type: 'text', required: true, localized: true, admin: { description: 'Örn. İstanbul Regional' } },
        {
          type: 'row',
          fields: [
            { name: 'rank', type: 'number', min: 1, admin: { description: 'Sıralama' } },
            { name: 'teams', type: 'number', min: 1, admin: { description: 'Etkinlikteki takım sayısı' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'wins', type: 'number', min: 0, defaultValue: 0 },
            { name: 'losses', type: 'number', min: 0, defaultValue: 0 },
            { name: 'ties', type: 'number', min: 0, defaultValue: 0 },
          ],
        },
        { name: 'result', type: 'text', localized: true, admin: { description: 'İsteğe bağlı sonuç, örn. Regional şampiyonu' } },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      admin: { description: 'Bu robotun sezon ödülleri' },
      fields: [
        { name: 'event', type: 'text', required: true, localized: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'banner', type: 'checkbox', label: 'Flama olarak göster', defaultValue: false, admin: { description: 'Sadece önemli ödüller için işaretle: robot sayfasında, ana sayfada ve ödüller sayfasında flama olarak görünür.' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Flama görseli (isteğe bağlı)', admin: { description: 'Doluysa otomatik mavi flama yerine bu görsel gösterilir (örn. kupa ya da ödül fotoğrafı). Yalnızca "Flama olarak göster" işaretliyse görünür.', condition: (_data, sibling) => Boolean(sibling?.banner) } },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Öne çıkan videolar' },
      admin: { description: 'Robot sayfasında kaydırılabilir şeritte gösterilir. Sürükleyerek sıralayabilirsin.' },
      fields: [
        { name: 'url', type: 'text', required: true, admin: { description: 'YouTube adresi, örn. https://youtu.be/xxxxxxxxxxx' } },
        { name: 'title', type: 'text', localized: true, admin: { description: 'İsteğe bağlı başlık (video altında görünür).' } },
      ],
    },
    {
      name: 'links',
      type: 'group',
      admin: { description: 'Sezon robotlarında The Blue Alliance, Statbotics ve FIRST Events adresleri boşsa sezon adresi otomatik kullanılır. Off-season robotlarda hepsi isteğe bağlıdır: yalnızca doldurduklarını gösterir.' },
      fields: [
        { name: 'tba', type: 'text', label: 'The Blue Alliance' },
        { name: 'youtube', type: 'text' },
        { name: 'statbotics', type: 'text', label: 'Statbotics' },
        { name: 'firstEvents', type: 'text', label: 'FIRST Events' },
        { name: 'chiefDelphi', type: 'text', label: 'Chief Delphi', admin: { description: "Robotun Chief Delphi tanıtım/build thread'i, örn. https://www.chiefdelphi.com/t/..." } },
        { name: 'chiefDelphiTitle', type: 'text', label: 'Chief Delphi başlığı', admin: { description: 'Örn. Team 9483 Presents: Enigma' } },
      ],
    },
    { name: 'epaRank', type: 'text' },
  ],
}
