import type { CollectionConfig } from 'payload'

import { slugify } from '@/lib/text'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', '_status'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  defaultSort: '-date',
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Boş bırakılırsa başlıktan otomatik üretilir (adres: /tr/blog/<slug>).' },
      hooks: {
        beforeValidate: [({ value, data }) => (value ? slugify(String(value)) : slugify(String(data?.title ?? '')))],
      },
    },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'excerpt', type: 'textarea', localized: true, maxLength: 200, admin: { description: 'Kısa özet: blog listesinde ve paylaşım önizlemesinde (WhatsApp, X, LinkedIn…) görünür.' } },
    { name: 'cover', type: 'upload', relationTo: 'media', admin: { description: 'Paylaşım önizlemesinde görünen görsel de budur.' } },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (isteğe bağlı)',
      admin: { description: 'Boş bırakılırsa her şey otomatik üretilir: başlık, özet/ilk cümleler, kapak görseli.' },
      fields: [
        { name: 'title', type: 'text', localized: true, admin: { description: 'Google başlığı (≈60 karakter). Boşsa yazı başlığı.' } },
        { name: 'description', type: 'textarea', localized: true, maxLength: 200, admin: { description: 'Google açıklaması (≈155 karakter). Boşsa özet, o da yoksa yazının ilk cümleleri.' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Paylaşım görseli. Boşsa kapak, o da yoksa site görseli.' } },
        { name: 'noIndex', type: 'checkbox', defaultValue: false, label: 'Arama motorlarından gizle' },
      ],
    },
  ],
}
