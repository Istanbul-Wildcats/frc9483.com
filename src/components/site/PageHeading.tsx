import { Wordmark, wordmarkUpperFits } from './Wordmark'

export function PageHeading({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <section className={`wrap pt-24 pb-14 ${center ? 'text-center' : ''}`}>
      <h1 className={`h1 ${wordmarkUpperFits(children) ? 'wordmark' : ''}`}>
        {wordmarkUpperFits(children) ? <Wordmark text={children} /> : children}
      </h1>
    </section>
  )
}

export const Mono = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`mono ${className ?? ''}`}>{children}</span>
)
