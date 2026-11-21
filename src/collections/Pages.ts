import type { CollectionConfig } from 'payload'

import { pageSlugs } from '@/i18n/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Sayfa', plural: 'Sayfalar' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Sitedeki her sayfanın başlığı, giriş metni ve SEO bilgileri buradan yönetilir.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) =>
        typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)
          ? true
          : 'Yalnızca küçük harf, rakam ve tire kullan (örn. kvkk-metni).',
      admin: {
        description: `Sayfanın adresi (/tr/<slug>). Hazır sayfalar: ${pageSlugs.join(', ')}. Başka bir slug yeni bir sayfa oluşturur; menüye eklemek için Menü global'ine /<slug> yaz.`,
      },
    },
    { name: 'title', type: 'text', required: true, localized: true, admin: { description: 'Yönetim panelinde görünen ad.' } },
    { name: 'heading', type: 'text', localized: true, admin: { description: 'Sayfanın büyük başlığı. Boşsa varsayılan kullanılır.' } },
    { name: 'intro', type: 'textarea', localized: true, admin: { description: 'Giriş metni (Katıl ve İletişim sayfalarında gösterilir).' } },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      admin: { description: 'Yeni (özel) sayfaların içeriği. Hazır sayfalarda kullanılmaz.' },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', localized: true, admin: { description: 'Tarayıcı sekmesi ve arama sonucu başlığı. Boşsa sayfa başlığı kullanılır.' } },
        { name: 'description', type: 'textarea', localized: true, maxLength: 200, admin: { description: 'Arama sonucu açıklaması (en fazla ~160 karakter önerilir).' } },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Paylaşım görseli (1200×630). Boşsa site geneli görsel kullanılır.' } },
        { name: 'noIndex', type: 'checkbox', defaultValue: false, label: 'Arama motorlarından gizle' },
      ],
    },
  ],
}
