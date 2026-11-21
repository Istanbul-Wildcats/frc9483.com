import type { Robot } from '@/payload-types'

type Labels = { title: string; event: string; rank: string; record: string; total: string; of: string }

/** Season results: one row per event (rank in field, W-L-T), plus the season total. */
export function SeasonTable({ events, labels }: { events: NonNullable<Robot['events']>; labels: Labels }) {
  if (!events.length) return null
  const sum = (k: 'wins' | 'losses' | 'ties') => events.reduce((n, e) => n + (e[k] ?? 0), 0)
  const rec = (w: number, l: number, t: number) => `${w}-${l}-${t}`
  return (
    <table className="w-full border-collapse text-left">
      <caption className="mono mb-4 text-left">{labels.title}</caption>
      <thead>
        <tr className="border-b border-line-strong text-sm text-muted">
          <th scope="col" className="py-3 pr-4 text-left font-normal">{labels.event}</th>
          <th scope="col" className="px-4 py-3 text-left font-normal">{labels.rank}</th>
          <th scope="col" className="py-3 pl-4 text-right font-normal">{labels.record}</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id} className="border-b border-line align-top">
            <th scope="row" className="py-5 pr-4 text-left font-normal">
              <span className="block text-[clamp(20px,2vw,26px)] leading-tight">{e.event}</span>
              {e.result && <span className="mono mt-1.5 block text-white">{e.result}</span>}
            </th>
            <td className="px-4 py-5 text-[clamp(20px,2vw,26px)] tabular-nums leading-tight">
              {e.rank ?? '-'}
              {e.teams ? <span className="text-muted"> / {e.teams}</span> : null}
              {e.teams ? <span className="sr-only"> ({e.teams} {labels.of})</span> : null}
            </td>
            <td className="py-5 pl-4 text-right text-[clamp(20px,2vw,26px)] tabular-nums leading-tight">
              {rec(e.wins ?? 0, e.losses ?? 0, e.ties ?? 0)}
            </td>
          </tr>
        ))}
      </tbody>
      {events.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row" colSpan={2} className="py-5 pr-4 text-left font-normal text-muted">{labels.total}</th>
            <td className="py-5 pl-4 text-right text-[clamp(20px,2vw,26px)] tabular-nums text-white">
              {rec(sum('wins'), sum('losses'), sum('ties'))}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )
}
