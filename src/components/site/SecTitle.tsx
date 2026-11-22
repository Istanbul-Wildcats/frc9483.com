import { Wordmark, wordmarkUpperFits } from './Wordmark'

/** Section heading. A4 SPEED when the text can be set in it (Turkish capitals are drawn), Anta otherwise. */
export function SecTitle({ children, className = '' }: { children: string; className?: string }) {
  const fits = wordmarkUpperFits(children)
  return <h2 className={`sec-title ${fits ? 'wordmark' : ''} ${className}`}>{fits ? <Wordmark text={children} /> : children}</h2>
}
