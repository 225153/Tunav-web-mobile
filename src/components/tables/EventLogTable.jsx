import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { VOIE_INDEXES, isVoieAlarm } from '../../utils/vigi.js'

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
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="overflow-x-auto">
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
            {logs.length === 0 && (
              <tr>
                <td colSpan={VOIE_INDEXES.length + 3} className="px-5 py-8 text-center text-slate-400 text-sm">
                  Aucune donnée pour ce filtre…
                </td>
              </tr>
            )}
            {logs.map((log) => {
              const activeVoies = VOIE_INDEXES.filter((i) => isVoieAlarm(log.alarmes, i))
              const hasAlarm = activeVoies.length > 0
              return (
                <tr
                  key={log.id}
                  className={`border-b border-slate-50 last:border-0 animate-row-in ${hasAlarm ? 'bg-red-50/40' : ''}`}
                >
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-5 py-3 font-medium text-brand-navy whitespace-nowrap">
                    {log.imei}
                  </td>
                  {VOIE_INDEXES.map((i) => (
                    <td
                      key={i}
                      className={`px-3 py-3 text-right whitespace-nowrap ${
                        isVoieAlarm(log.alarmes, i) ? 'font-semibold text-red-600' : 'text-slate-500'
                      }`}
                    >
                      {formatVoie(log[`voie${i}`])}
                    </td>
                  ))}
                  <td className="px-5 py-3">
                    {hasAlarm ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        V{activeVoies.join(', V')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
