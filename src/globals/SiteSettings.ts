import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  label: 'Site ayarları',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Overcharge · FRC 9483',
      admin: { description: 'Sekme başlığı ve paylaşımlarda site adı.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Varsayılan site açıklaması (SEO).' },
    },
    { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Varsayılan paylaşım görseli (1200×630).' } },
    { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon (koyu tema)', admin: { description: 'Koyu temada görünen ikon: şeffaf PNG, beyaz logo, kare.' } },
    { name: 'faviconLight', type: 'upload', relationTo: 'media', label: 'Favicon (açık tema)', admin: { description: 'Açık temada görünen ikon: şeffaf PNG, siyah logo, kare.' } },
    { name: 'footerTitle', type: 'text', defaultValue: 'OVERCHARGE', admin: { description: 'Alt bilgideki büyük yazı.' } },
    { name: 'footerSubtitle', type: 'text', defaultValue: '#9483 · İstanbul' },
    {
      name: 'teamName',
      type: 'text',
      required: true,
      defaultValue: 'FRC 9483 İstanbul Wildcats',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'forms',
      type: 'group',
      admin: { description: 'Katıl butonunun gideceği Google Form bağlantısı. İletişim formu sitede yerleşiktir; mesajlar "Gelen mesajlar" altında toplanır.' },
      fields: [
        { name: 'joinUrl', type: 'text' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'showOnContact', type: 'checkbox', label: 'İletişim sayfasında göster', defaultValue: false },
      ],
    },
  ],
}
