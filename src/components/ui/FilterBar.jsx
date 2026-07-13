import { Calendar, RotateCcw, X } from 'lucide-react'

const LIMIT_OPTIONS = [25, 50, 100, 200, 500]

export default function FilterBar({ limit, onLimitChange, date, onDateChange, onRefresh, resultCount }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:flex sm:items-center gap-3 sm:gap-4">
        <div className="sm:flex-1">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1" htmlFor="date-filter">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Date
          </label>
          <div className="flex items-center gap-2">
            <input
              id="date-filter"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-auto text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            {date && (
              <button
                type="button"
                onClick={() => onDateChange('')}
                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-brand-navy shrink-0"
                aria-label="Effacer le filtre de date"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="limit-filter">
            Afficher
          </label>
          <select
            id="limit-filter"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="w-full sm:w-auto text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} dernières mesures
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{resultCount} résultat{resultCount > 1 ? 's' : ''}</span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Rafraîchir
        </button>
      </div>
    </div>
  )
}
