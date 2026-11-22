import type { Robot } from '@/payload-types'

type Labels = { title: string; event: string; rank: string; record: string; total: string; of: string }

/** Season results: one row per event (rank in field, W-L-T), plus the season total. */
export function SeasonTable({ events, labels }: { events: NonNullable<Robot['events']>; labels: Labels }) {
  if (!events.some((e) => e.rank != null || e.wins || e.losses || e.ties)) return null
  const sum = (k: 'wins' | 'losses' | 'ties') => events.reduce((n, e) => n + (e[k] ?? 0), 0)
  const rec = (w: number, l: number, t: number) => `${w}-${l}-${t}`
  return (
    // nowrap values + min-width: at 390px the record and header cells stay on one line and the table scrolls instead of breaking
    <div>
      {/* same heading as the "Sezon ödülleri" column so the two columns line up */}
      <h2 className="sec-title mb-8">{labels.title}</h2>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left">
      <caption className="sr-only">{labels.title}</caption>
      <thead>
        <tr className="border-b border-line-strong text-sm text-muted">
          <th scope="col" className="py-3 pr-4 text-left font-normal">{labels.event}</th>
          <th scope="col" className="whitespace-nowrap px-4 py-3 text-left font-normal">{labels.rank}</th>
          <th scope="col" className="whitespace-nowrap py-3 pl-4 text-right font-normal">{labels.record}</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id} className="border-b border-line align-top">
            <th scope="row" className="py-5 pr-4 text-left font-normal">
              <span className="block text-[clamp(20px,2vw,26px)] leading-tight">{e.event}</span>
              {e.result && <span className="mono mt-1.5 block text-white">{e.result}</span>}
            </th>
            <td className="whitespace-nowrap px-4 py-5 text-[clamp(20px,2vw,26px)] tabular-nums leading-tight">
              {e.rank ?? '-'}
              {e.teams ? <span className="text-muted"> / {e.teams}</span> : null}
              {e.teams ? <span className="sr-only"> ({e.teams} {labels.of})</span> : null}
            </td>
            <td className="whitespace-nowrap py-5 pl-4 text-right text-[clamp(20px,2vw,26px)] tabular-nums leading-tight">
              {rec(e.wins ?? 0, e.losses ?? 0, e.ties ?? 0)}
            </td>
          </tr>
        ))}
      </tbody>
      {events.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row" colSpan={2} className="py-5 pr-4 text-left font-normal text-muted">{labels.total}</th>
            <td className="whitespace-nowrap py-5 pl-4 text-right text-[clamp(20px,2vw,26px)] tabular-nums text-white">
              {rec(sum('wins'), sum('losses'), sum('ties'))}
            </td>
          </tr>
        </tfoot>
      )}
      </table>
      </div>
    </div>
  )
}
