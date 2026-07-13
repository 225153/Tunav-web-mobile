import { Calendar, RotateCcw, X } from 'lucide-react'

const LIMIT_OPTIONS = [25, 50, 100, 200, 500]

export default function FilterBar({ limit, onLimitChange, date, onDateChange, onRefresh, resultCount }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2 flex-1">
        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
        <label className="text-xs font-medium text-slate-500 whitespace-nowrap" htmlFor="date-filter">
          Date
        </label>
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
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-brand-navy"
            aria-label="Effacer le filtre de date"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 whitespace-nowrap" htmlFor="limit-filter">
          Afficher
        </label>
        <select
          id="limit-filter"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} dernières mesures
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 sm:ml-auto">
        <span className="text-xs text-slate-400">{resultCount} résultat{resultCount > 1 ? 's' : ''}</span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Rafraîchir
        </button>
      </div>
    </div>
  )
}
