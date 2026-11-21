import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { ContactMessages } from './collections/ContactMessages'
import { GalleryImages } from './collections/GalleryImages'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Robots } from './collections/Robots'
import { Sponsors } from './collections/Sponsors'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { Navigation } from './globals/Navigation'
import { Resources } from './globals/Resources'
import { withGlobalRevalidation, withRevalidation } from './lib/revalidate'
import { SiteSettings } from './globals/SiteSettings'
import { UiText } from './globals/UiText'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [
    Users,
    ...[Media, Pages, Robots, Sponsors, Posts, Products, GalleryImages].map(withRevalidation),
    ContactMessages,
  ],
  globals: [SiteSettings, UiText, Home, About, Navigation, Resources].map(withGlobalRevalidation),
  editor: lexicalEditor(),
  plugins: [
    // Uploads go to Vercel Blob in production (Vercel's disk is read-only); locally they stay in /media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
      clientUploads: true, // browser uploads straight to Blob, so photos over Vercel's 4.5 MB body limit work
    }),
  ],
  // No mail provider is connected (contact messages are stored in the panel). This keeps Payload's
  // default behaviour of printing outgoing mail to the console, without the startup warning.
  email: ({ payload }) => ({
    name: 'console',
    defaultFromAddress: 'hello@frc9483.com',
    defaultFromName: 'FRC 9483',
    sendEmail: async (message) => {
      payload.logger.info(`Email (not sent, no provider): ${JSON.stringify(message)}`)
    },
  }),
  // admin panel language: Turkish by default, English selectable in the account menu
  i18n: { supportedLanguages: { tr, en }, fallbackLanguage: 'tr' },
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  localization: {
    locales: [
      { code: 'tr', label: 'Türkçe' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },
})
