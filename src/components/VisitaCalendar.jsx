import { Link } from 'react-router-dom'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const START_YEAR = 2023

export function VisitaCalendar({ visitas }) {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = START_YEAR; y <= currentYear; y++) years.push(y)

  const byMonth = {}
  for (const v of visitas) {
    const d = new Date(v.fecha)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(v)
  }

  return (
    <div className="w-full md:w-80 md:shrink-0 space-y-0">
      {years.map((year, i) => (
        <div key={year} className={i > 0 ? 'border-t border-border pt-4 mt-4' : 'pb-4'}>
          <h3 className="text-lg font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {year}
          </h3>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((monthName, monthIdx) => {
              const key = `${year}-${monthIdx}`
              const monthVisitas = byMonth[key] ?? []
              return (
                <div key={monthIdx} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground text-center select-none">
                    {monthName}
                  </span>
                  {monthVisitas.length === 0 ? (
                    <div className="rounded border border-dashed border-border/40 h-10" />
                  ) : (
                    monthVisitas.map((v) => (
                      <Link
                        key={v._id}
                        to={`/visitas/${v._id}`}
                        className="block rounded px-1.5 py-0.5 transition-opacity hover:opacity-80 min-h-10" style={{ backgroundColor: 'darkgreen' }}
                      >
                        <p className="text-xs font-medium line-clamp-2 leading-tight text-white">{v.sitio}</p>
                        <p className="text-xs leading-tight text-blue-200">
                          {new Date(v.fecha).toLocaleDateString('es-ES')}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
