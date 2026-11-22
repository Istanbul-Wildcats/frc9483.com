/** URL slug from a title, with Turkish letters transliterated. */
export const slugify = (v: string) =>
  v
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** All text of a Lexical document, one string. */
export function lexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown[]; root?: unknown }
  if (n.root) return lexicalText(n.root)
  if (typeof n.text === 'string') return n.text
  return (n.children ?? []).map(lexicalText).join(' ')
}

/** ~155 characters cut at a word boundary: what a search result snippet fits. */
export function snippet(text: string, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : undefined).replace(/[,;:.\s-]+$/, '') + '…'
}

/**
 * A4 SPEED only has basic Latin glyphs (no ç ğ ı ö ş ü İ). Headings that fit entirely get the wordmark face;
 * anything else keeps Anta, so a Turkish heading never mixes two typefaces letter by letter.
 */
export const wordmarkFits = (t: unknown): t is string => typeof t === 'string' && /^[\x20-\x7E]+$/.test(t)
export const wordmarkClass = (t: unknown) => (wordmarkFits(t) ? 'wordmark' : '')
