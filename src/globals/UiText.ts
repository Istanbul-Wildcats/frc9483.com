import type { GlobalConfig } from 'payload'

import { uiDefaults, uiKeys } from '@/i18n/config'

export const UiText: GlobalConfig = {
  slug: 'ui-text',
  label: 'Arayüz metinleri',
  access: { read: () => true },
  admin: { description: 'Butonlar ve küçük etiketler. Boş bırakılan alan varsayılan metni kullanır.' },
  fields: uiKeys.map((key) => ({
    name: key,
    type: 'text',
    localized: true,
    admin: { description: `Varsayılan: ${uiDefaults.tr[key]}` },
  })),
}
