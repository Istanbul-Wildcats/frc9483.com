// Roboto used to be loaded just for these pennants (~100 KB of font on the home page);
// the body font already ships bold + italic, so the banners inherit it.
type Award = { id?: string | null; event: string; title: string; banner?: boolean | null; season?: number }

/** TBA-style award name: "Regional Winner(s)" -> "Winner" */
const shortTitle = (t: string) => t.replace(/^Regional\s+/i, '').replace(/Winners$/i, 'Winner')

/** Pennants for the awards flagged "Flama olarak göster", laid out like the banners on thebluealliance.com */
export function AwardBanners({ awards, season, className = '' }: { awards: Award[]; season?: number; className?: string }) {
  const shown = awards.filter((a) => a.banner)
  if (!shown.length) return null
  return (
    <ul lang="en" className={`flex flex-wrap gap-x-4 gap-y-0 text-[14px] leading-[1.2] ${className}`}>
      {shown.map((a, i) => {
        const name = shortTitle(a.title)
        const event = `${a.season ?? season} ${a.event}`
        return (
          <li key={a.id ?? i} className="relative mb-10 h-[170px] w-[140px] bg-[#0f4bcb] p-2 text-center text-white [filter:drop-shadow(0_5px_5px_rgba(0,0,0,.1))]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/first-icon.svg" alt="" width={75} height={45} className="mx-auto my-2.5 max-h-[45px] w-[75px]" />
            <div className="table h-[35px] w-full" style={{ margin: '3px 0' }}>
              <span className={`table-cell align-middle font-bold uppercase italic text-[14px]`}>{name}</span>
            </div>
            <div className={`table h-[50px] w-full text-[11.9px] uppercase leading-[130%]`}>
              <span className="table-cell max-w-[124px] overflow-hidden align-middle">{event}</span>
            </div>
            <span aria-hidden className="absolute left-0 top-full block border-solid border-[#0f4bcb] border-b-transparent [border-width:5px_70px_20px]" />
          </li>
        )
      })}
    </ul>
  )
}
