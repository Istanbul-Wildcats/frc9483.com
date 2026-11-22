/**
 * Upper-cased heading text for A4 SPEED, which has only basic Latin capitals. The Turkish capitals it lacks
 * (İ Ş Ç Ğ Ö Ü) are drawn as the base letter plus a CSS-drawn mark (.wm-* in globals.css).
 */
const MARKS: Record<string, [letter: string, mark: 'dot' | 'ced' | 'brv' | 'dia']> = {
  İ: ['I', 'dot'], Ş: ['S', 'ced'], Ç: ['C', 'ced'], Ğ: ['G', 'brv'], Ö: ['O', 'dia'], Ü: ['U', 'dia'],
}

/** True when the text, upper-cased in Turkish, only needs basic Latin capitals or the marked letters above. */
export const wordmarkUpperFits = (t: unknown): t is string =>
  typeof t === 'string' && t.length > 0 && [...t.toLocaleUpperCase('tr')].every((c) => /[\x20-\x7E]/.test(c) || c in MARKS)

export function Wordmark({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text.toLocaleUpperCase('tr')].map((c, i) =>
          MARKS[c] ? <span key={i} className={`wm wm-${MARKS[c][1]}`}>{MARKS[c][0]}</span> : c,
        )}
      </span>
    </>
  )
}
