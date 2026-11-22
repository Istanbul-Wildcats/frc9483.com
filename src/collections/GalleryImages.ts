import type { CollectionConfig } from 'payload'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: { singular: 'Galeri görseli', plural: 'Galeri' },
  admin: { useAsTitle: 'caption', defaultColumns: ['caption', 'image', 'order'] },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'order', type: 'number', defaultValue: 100 },
  ],
}
