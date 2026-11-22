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
        { name: 'description', type: 'text', localized: true, admin: { description: 'Bağlantının ne işe yaradığı, tek satır.' } },
      ],
    },
  ],
}
