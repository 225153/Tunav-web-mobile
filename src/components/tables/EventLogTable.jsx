import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const STATUS_BADGE = {
  ok: { label: 'OK', className: 'bg-emerald-50 text-emerald-600', Icon: CheckCircle2 },
  warning: { label: 'Warning', className: 'bg-amber-50 text-amber-600', Icon: Info },
  alert: { label: 'Alert', className: 'bg-red-50 text-red-600', Icon: AlertTriangle },
}

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

export default function EventLogTable({ logs }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-brand-navy">Recent Event Logs</h2>
        <p className="text-xs text-slate-400">Last 5 entries pushed to live_telemetry</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Device</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">
                  Waiting for live data…
                </td>
              </tr>
            )}
            {logs.map((log) => {
              const badge = STATUS_BADGE[log.status] ?? STATUS_BADGE.ok
              const { Icon } = badge
              return (
                <tr
                  key={log.id}
                  className="border-b border-slate-50 last:border-0 animate-row-in"
                >
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-5 py-3 font-medium text-brand-navy whitespace-nowrap">
                    {log.device_name || log.device_id}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 max-w-xs truncate">
                    {log.message || '—'}
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
