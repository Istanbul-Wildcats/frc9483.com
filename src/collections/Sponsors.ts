import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Sponsor', plural: 'Sponsorlar' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'status', 'order'] },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Marka adı (örn. AXA Sigorta).' } },
    { name: 'legalName', type: 'text', admin: { description: 'Varsa tam şirket unvanı; markanın altında küçük yazılır.' } },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Beyaz/şeffaf logo. Yoksa marka adı yazı olarak gösterilir.' } },
    { name: 'url', type: 'text', label: 'Web sitesi', admin: { description: 'Sponsorun sitesi (örn. https://axa.com.tr). Doluysa logo bu adrese bağlanır; boşsa logo bağlantısız görünür.' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Aktif (devam eden sponsorluk)', value: 'active' },
        { label: 'Geçmiş sponsor', value: 'past' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}
