import type { CollectionConfig } from 'payload'

import { processImage, processingModes, type ProcessingMode } from '@/lib/image-processing'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    // Runs on the uploaded file before it is stored: converts it according to the "Otomatik dönüştürme" choice.
    beforeOperation: [
      async ({ args, operation, req }) => {
        const mode = (args as { data?: { processing?: string } }).data?.processing as ProcessingMode | undefined
        if ((operation !== 'create' && operation !== 'update') || !mode || !processingModes.includes(mode) || !req.file?.data?.length) return args
        const data = await processImage[mode](req.file.data)
        req.file = { ...req.file, data, size: data.length, mimetype: 'image/png', name: req.file.name.replace(/\.[^.]+$/, '') + '.png' }
        return args
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'processing',
      type: 'select',
      virtual: true,
      defaultValue: 'none',
      label: 'Otomatik dönüştürme',
      options: [
        { label: 'Yok (olduğu gibi yükle)', value: 'none' },
        { label: 'PNG’ye çevir', value: 'png' },
        { label: 'Logo: siyah zemini şeffaf yap, beyaza boya (site renkleri)', value: 'logo' },
      ],
      admin: {
        description: 'Sadece dosya yüklerken uygulanır. Logo seçeneği siyah zeminli beyaz logoyu şeffaf, beyaz bir PNG’ye çevirir. Siyah robot fotoğrafları için kullanma: robotun siyah kısımlarını da siler.',
      },
    },
  ],
  upload: true,
}
