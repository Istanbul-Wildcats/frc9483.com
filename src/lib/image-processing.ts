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
