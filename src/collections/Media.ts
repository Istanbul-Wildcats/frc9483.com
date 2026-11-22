import type { CollectionConfig } from 'payload'

import { capSize, processImage, processingModes, type ProcessingMode } from '@/lib/image-processing'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    // Runs on the uploaded file before it is stored: converts it according to the "Otomatik dönüştürme" choice,
    // then downscales anything larger than 2400px on its longest side (smaller files are left untouched).
    beforeOperation: [
      async ({ args, operation, req }) => {
        if ((operation !== 'create' && operation !== 'update') || !req.file?.data?.length) return args
        let file = req.file
        const mode = (args as { data?: { processing?: string } }).data?.processing as ProcessingMode | undefined
        if (mode && processingModes.includes(mode)) {
          const data = await processImage[mode](file.data)
          file = { ...file, data, size: data.length, mimetype: 'image/png', name: file.name.replace(/\.[^.]+$/, '') + '.png' }
        }
        const capped = await capSize(file.data, file.mimetype)
        if (capped) file = { ...file, data: capped, size: capped.length }
        req.file = file
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
