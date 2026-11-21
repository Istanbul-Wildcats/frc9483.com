import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroTitle', type: 'text', required: true, defaultValue: 'Overcharge' },
    { name: 'heroTag', type: 'text', defaultValue: '#9483' },
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
