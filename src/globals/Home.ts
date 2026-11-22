import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroTitle', type: 'text', required: true, defaultValue: 'Overcharge' },
    { name: 'heroTag', type: 'text', defaultValue: '#9483' },
    {
      name: 'heroOverlay',
      type: 'number',
      label: 'Hero karartma (%)',
      min: 0,
      max: 100,
      defaultValue: 70,
      admin: { step: 5, description: 'Görselin başlığın arkasına gelen alt kısmının karartma oranı. Başlık okunmuyorsa artır, görsel çok koyuysa azalt.' },
    },
    { name: 'sideImage', type: 'upload', relationTo: 'media', admin: { description: 'Başarılar yanındaki görsel' } },
    { name: 'pairImages', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 2 },
    {
      name: 'highlights',
      type: 'array',
      admin: { description: 'Ana sayfa "Başarılar" listesi' },
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
      ],
    },
    { name: 'ctaText', type: 'text', localized: true, defaultValue: 'Takımımıza katılmak ister misin?' },
  ],
}
