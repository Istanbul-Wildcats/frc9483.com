import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Ürün', plural: 'Mağaza ürünleri' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'quantity', 'createdAt'] },
  access: { read: () => true },
  defaultSort: '-createdAt', // newest product first
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: 'Ürün adı' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Görsel', admin: { description: 'Kare bir kutu içinde gösterilir; ürünün tamamı görünür.' } },
    {
      name: 'quantity',
      type: 'number',
      label: 'Adet',
      min: 0,
      defaultValue: 1,
      admin: { step: 1, description: 'Stoktaki adet. 0 yazılırsa üründe "Tükendi" görünür; boş bırakılırsa adet gösterilmez.' },
    },
  ],
}
