/**
 * Cuts the logos out of a rendered slide (white logos on black) and writes each one as a
 * white-on-transparent PNG: the brightness of every pixel becomes its alpha, so the black
 * background disappears and edges stay anti-aliased.
 *
 * usage: node scripts/extract-logos.mjs <slide.png> <outDir> [scale]
 *   scale = how many times larger the slide image is than the 1900px-wide reference grid below
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const [input, outDir] = process.argv.slice(2)
// Approximate centres of the logos on the 2025 sponsor slide (reference grid 1900px wide).
const known = {
  wcp: [120, 175], dijitalpark: [625, 175], futurebright: [1200, 170], rtx: [1670, 170],
  rockwell: [405, 395], 'team-mark': [925, 470], boeing: [1440, 395],
  orjin: [500, 565], dowaksa: [1360, 570], besmak: [620, 735], asa: [925, 735], kaban: [1260, 730],
}

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info
const ref = 1900 / W
const lum = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])

// 1) coarse mask (1/3 size) dilated so the parts of one logo merge into one blob
const f = 3, w = Math.ceil(W / f), h = Math.ceil(H / f), R = 14
const mask = new Uint8Array(w * h)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (lum(y * W + x) > 90) mask[Math.floor(y / f) * w + Math.floor(x / f)] = 1
const dil = new Uint8Array(w * h)
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (!mask[y * w + x]) continue
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const yy = y + dy, xx = x + dx
      if (yy >= 0 && yy < h && xx >= 0 && xx < w) dil[yy * w + xx] = 1
    }
  }
}
// 2) connected components -> bounding boxes of the *original* (undilated) pixels
const seen = new Uint8Array(w * h)
const boxes = []
for (let s = 0; s < w * h; s++) {
  if (!dil[s] || seen[s]) continue
  const stack = [s]; seen[s] = 1
  let x0 = w, y0 = h, x1 = 0, y1 = 0, count = 0
  while (stack.length) {
    const p = stack.pop(), x = p % w, y = (p / w) | 0
    if (mask[p]) { count++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy, q = yy * w + xx
      if (xx >= 0 && xx < w && yy >= 0 && yy < h && dil[q] && !seen[q]) { seen[q] = 1; stack.push(q) }
    }
  }
  if (count > 40) boxes.push({ x0: x0 * f, y0: y0 * f, x1: (x1 + 1) * f, y1: (y1 + 1) * f })
}
// 3) name each blob by the nearest known centre, crop, black -> transparent
const used = new Set()
for (const b of boxes) {
  const cx = ((b.x0 + b.x1) / 2) * ref, cy = ((b.y0 + b.y1) / 2) * ref
  const [name] = Object.entries(known).filter(([n]) => !used.has(n))
    .sort((a, c) => Math.hypot(a[1][0] - cx, a[1][1] - cy) - Math.hypot(c[1][0] - cx, c[1][1] - cy))[0]
  used.add(name)
  const pad = 6
  const left = Math.max(0, b.x0 - pad), top = Math.max(0, b.y0 - pad)
  const cw = Math.min(W, b.x1 + pad) - left, ch = Math.min(H, b.y1 + pad) - top
  const { data: crop } = await sharp(input).removeAlpha().extract({ left, top, width: cw, height: ch }).raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(cw * ch * 4)
  for (let i = 0; i < cw * ch; i++) {
    const a = Math.max(crop[i * 3], crop[i * 3 + 1], crop[i * 3 + 2])
    out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = 255
    out[i * 4 + 3] = a < 24 ? 0 : a // drop compression noise in the black
  }
  const file = path.join(outDir, `logo-${name}.png`)
  await sharp(out, { raw: { width: cw, height: ch, channels: 4 } }).trim().png().toFile(file)
  console.log(name.padEnd(12), `${cw}x${ch}`, '->', file)
}
console.log('blobs:', boxes.length, 'named:', used.size)
