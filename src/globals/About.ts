import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  access: { read: () => true },
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'whoImage', type: 'upload', relationTo: 'media', admin: { description: '"Biz kimiz?" bölümünün yanındaki görsel.' } },
    { name: 'lead', type: 'textarea', localized: true },
    { name: 'paragraphs', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true, localized: true }] },
    { name: 'tagline', type: 'text', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'rankings',
      type: 'array',
      admin: { description: 'Sezona göre sıralama' },
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'result', type: 'text', localized: true },
      ],
    },
    { name: 'pairImages', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 2 },
    {
      name: 'teams',
      type: 'array',
      admin: { description: 'Takımdaki ekipler' },
      fields: [{ name: 'name', type: 'text', required: true, localized: true }],
    },
  ],
}
