import type { CollectionConfig } from 'payload'

const staffOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** Messages sent from the contact form. Created only by the server action; readable only in the admin. */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Mesaj', plural: 'Gelen mesajlar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'],
    description: 'İletişim formundan gelen mesajlar.',
  },
  defaultSort: '-createdAt',
  access: { create: () => false, read: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    {
      name: 'topic',
      type: 'select',
      options: [
        { label: 'Sponsorluk', value: 'sponsorship' },
        { label: 'İş birliği', value: 'collaboration' },
        { label: 'Takıma katılım', value: 'join' },
        { label: 'Diğer', value: 'other' },
      ],
      admin: { readOnly: true },
    },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    { name: 'locale', type: 'text', admin: { readOnly: true, description: 'Formun gönderildiği site dili.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'Okundu', value: 'read' },
        { label: 'Yanıtlandı', value: 'replied' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
