/**
 * One-off: copies the files in ./media (the local uploads folder) to Vercel Blob, under the same
 * file names Payload stores in the database, so existing Media items keep working in production.
 *
 * usage: BLOB_READ_WRITE_TOKEN=... node scripts/upload-media-to-blob.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { put } = require('@vercel/blob')

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set')

const dir = path.resolve('media')
const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile())
for (const f of files) {
  await put(f, fs.readFileSync(path.join(dir, f)), { access: 'public', addRandomSuffix: false, allowOverwrite: true, token })
  console.log('uploaded', f)
}
console.log(`${files.length} files`)
