import type { GlobalConfig } from 'payload'

export const Resources: GlobalConfig = {
  slug: 'resources',
  access: { read: () => true },
  fields: [
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
