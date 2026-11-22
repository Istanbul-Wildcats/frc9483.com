import sharp from 'sharp'

/**
 * Upload-time image tools, picked on a Media item in the admin panel ("Otomatik dönüştürme").
 * Every tool returns a PNG buffer.
 */
export const processingModes = ['png', 'logo'] as const
export type ProcessingMode = (typeof processingModes)[number]

/** Plain conversion to PNG (keeps transparency if the source has it). */
const toPng = (input: Buffer) => sharp(input).rotate().png().toBuffer()

/**
 * White logo on a black background -> white-on-transparent PNG.
 * The brightness of every pixel becomes its alpha, so the black disappears and
 * anti-aliased edges stay smooth. Output is pure white, which is what the dark site expects.
 */
async function logoToTransparentWhite(input: Buffer) {
  const { data, info } = await sharp(input).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const n = info.width * info.height
  const out = Buffer.alloc(n * 4)
  for (let i = 0; i < n; i++) {
    const a = Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])
    out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = 255
    out[i * 4 + 3] = a < 24 ? 0 : a // drop compression noise in the black
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer()
}

export const processImage: Record<ProcessingMode, (input: Buffer) => Promise<Buffer>> = {
  png: toPng,
  logo: logoToTransparentWhite,
}

/** Longest side kept on upload: 2400px is above the largest size the site ever requests (deviceSizes tops out at 2048). */
export const MAX_SIDE = 2400

/**
 * Downscales oversized photos only. Smaller images come back untouched (null), so nothing is
 * re-encoded needlessly. Quality is kept high: JPEG 92 (4:4:4, mozjpeg), WebP 92, PNG lossless;
 * the colour profile is preserved (phone photos are often Display P3) and EXIF rotation is applied.
 */
export async function capSize(input: Buffer, mimetype: string): Promise<Buffer | null> {
  if (!/^image\/(jpeg|png|webp)$/.test(mimetype)) return null
  const { width = 0, height = 0 } = await sharp(input).metadata()
  if (Math.max(width, height) <= MAX_SIDE) return null
  const img = sharp(input).rotate().resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true }).keepIccProfile()
  const out =
    mimetype === 'image/jpeg' ? await img.jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer()
    : mimetype === 'image/webp' ? await img.webp({ quality: 92 }).toBuffer()
    : await img.png({ compressionLevel: 9 }).toBuffer()
  // never make a file bigger than the original
  return out.length < input.length ? out : null
}
