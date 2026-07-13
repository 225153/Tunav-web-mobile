import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { VOIE_INDEXES, isVoieAlarm, isVoieDepassementBas, getActiveDefauts } from '../../utils/vigi.js'

function formatDateTime(isoString) {
  try {
    return new Date(isoString).toLocaleString([], {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return isoString
  }
}

function formatVoie(value) {
  return value == null ? '—' : Number(value).toFixed(1)
}

export default function EventLogTable({ logs, title = 'Historique des mesures', subtitle }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {logs.length === 0 && (
        <p className="px-5 py-8 text-center text-slate-400 text-sm">Aucune donnée pour ce filtre…</p>
      )}

      {/* Mobile: compact card list (avoids cramped horizontal scrolling) */}
      {logs.length > 0 && (
        <div className="sm:hidden divide-y divide-slate-100">
          {logs.map((log) => {
            const activeAlarms = VOIE_INDEXES.filter((i) => isVoieAlarm(log.alarmes, i))
            const activeDepassementsBas = VOIE_INDEXES.filter((i) => isVoieDepassementBas(log.depassements, i))
            const activeDefauts = getActiveDefauts(log.defauts)
            const hasAlarm = activeAlarms.length > 0
            const hasDepassementBas = activeDepassementsBas.length > 0
            const hasDefauts = activeDefauts.length > 0
            
            let rowBg = ''
            if (hasAlarm) {
              rowBg = 'bg-red-50/30'
            } else if (hasDefauts) {
              rowBg = 'bg-orange-50/25'
            } else if (hasDepassementBas) {
              rowBg = 'bg-amber-50/20'
            }

            return (
              <div key={log.id} className={`p-4 animate-row-in ${rowBg}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-brand-navy truncate">{log.imei}</p>
                      {hasDefauts && (
                        <span className="text-xs text-orange-600 animate-pulse" title={`Défauts: ${activeDefauts.join(', ')}`}>
                          🛠️
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{formatDateTime(log.timestamp)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {hasAlarm && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Haut: V{activeAlarms.join(',')}
                      </span>
                    )}
                    {hasDepassementBas && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        Bas: V{activeDepassementsBas.join(',')}
                      </span>
                    )}
                    {!hasAlarm && !hasDepassementBas && !hasDefauts && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        OK
                      </span>
                    )}
                  </div>
                </div>

                {hasDefauts && (
                  <div className="mb-2.5 px-2 py-1 rounded bg-orange-100/50 border border-orange-200/30 text-[10px] text-orange-850 font-medium flex items-center gap-1">
                    <span className="shrink-0 font-bold text-orange-700">🛠️ Défaut:</span>
                    <span className="truncate">{activeDefauts.join(', ')}</span>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-1.5">
                  {VOIE_INDEXES.map((i) => {
                    const isAlarm = isVoieAlarm(log.alarmes, i)
                    const isLow = isVoieDepassementBas(log.depassements, i)
                    
                    let bgClass = 'bg-slate-50 text-slate-500 border border-slate-100/30'
                    let label = `V${i}`
                    
                    if (isAlarm) {
                      bgClass = 'bg-red-50 text-red-600 font-semibold border border-red-200/40 shadow-sm'
                      label = `V${i} ▲`
                    } else if (isLow) {
                      bgClass = 'bg-amber-50 text-amber-600 font-semibold border border-amber-200/40 shadow-sm'
                      label = `V${i} ▼`
                    }

                    return (
                      <div key={i} className={`rounded-md px-1 py-1 text-center ${bgClass}`}>
                        <p className="text-[9px] uppercase tracking-wide opacity-80">{label}</p>
                        <p className="text-xs">{formatVoie(log[`voie${i}`])}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Desktop / tablet: full table */}
      {logs.length > 0 && (
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="px-5 py-3 font-medium whitespace-nowrap">Time</th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">Device</th>
                {VOIE_INDEXES.map((i) => (
                  <th key={i} className="px-3 py-3 font-medium text-right whitespace-nowrap">
                    V{i}
                  </th>
                ))}
                <th className="px-5 py-3 font-medium whitespace-nowrap">Alarmes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const activeAlarms = VOIE_INDEXES.filter((i) => isVoieAlarm(log.alarmes, i))
                const activeDepassementsBas = VOIE_INDEXES.filter((i) => isVoieDepassementBas(log.depassements, i))
                const activeDefauts = getActiveDefauts(log.defauts)
                const hasAlarm = activeAlarms.length > 0
                const hasDepassementBas = activeDepassementsBas.length > 0
                const hasDefauts = activeDefauts.length > 0

                let rowBg = ''
                if (hasAlarm) {
                  rowBg = 'bg-red-50/20 hover:bg-red-50/30'
                } else if (hasDefauts) {
                  rowBg = 'bg-orange-50/15 hover:bg-orange-50/25'
                } else if (hasDepassementBas) {
                  rowBg = 'bg-amber-50/10 hover:bg-amber-50/20'
                } else {
                  rowBg = 'hover:bg-slate-50/70'
                }

                return (
                  <tr
                    key={log.id}
                    className={`border-b border-slate-50 last:border-0 transition-colors animate-row-in ${rowBg}`}
                  >
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-navy whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{log.imei}</span>
                        {hasDefauts && (
                          <span 
                            className="cursor-help text-orange-600 animate-pulse" 
                            title={`Défauts matériels: ${activeDefauts.join(', ')}`}
                          >
                            🛠️
                          </span>
                        )}
                      </div>
                    </td>
                    {VOIE_INDEXES.map((i) => {
                      const isAlarm = isVoieAlarm(log.alarmes, i)
                      const isLow = isVoieDepassementBas(log.depassements, i)
                      let cellClass = 'text-slate-500'
                      let suffix = null

                      if (isAlarm) {
                        cellClass = 'font-semibold text-red-600'
                        suffix = <span className="text-[10px] ml-1 font-bold text-red-500">▲</span>
                      } else if (isLow) {
                        cellClass = 'font-semibold text-amber-600'
                        suffix = <span className="text-[10px] ml-1 font-bold text-amber-500">▼</span>
                      }

                      return (
                        <td key={i} className={`px-3 py-3 text-right whitespace-nowrap ${cellClass}`}>
                          {formatVoie(log[`voie${i}`])}
                          {suffix}
                        </td>
                      )
                    })}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hasAlarm && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Haut (V{activeAlarms.join(', ')})
                          </span>
                        )}
                        {hasDepassementBas && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Bas (V{activeDepassementsBas.join(', ')})
                          </span>
                        )}
                        {hasDefauts && (
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/40"
                            title={activeDefauts.join(', ')}
                          >
                            🛠️ {activeDefauts.length === 1 ? activeDefauts[0] : `${activeDefauts.length} Défauts`}
                          </span>
                        )}
                        {!hasAlarm && !hasDepassementBas && !hasDefauts && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Normal
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
