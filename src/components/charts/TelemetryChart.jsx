import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const VOIE_COLORS = {
  voie1: '#1769FF',
  voie2: '#00A3FF',
  voie3: '#0B2545',
  voie4: '#F59E0B',
  voie5: '#EF4444',
  voie6: '#10B981',
  voie7: '#8B5CF6',
}

const VOIE_KEYS = Object.keys(VOIE_COLORS)

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="text-slate-400 mb-1">{formatTime(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value ?? '—'}
        </p>
      ))}
    </div>
  )
}

export default function TelemetryChart({ data }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-brand-navy">Telemetry Trend</h2>
          <p className="text-xs text-slate-400">Voies 1 à 7 — mesures</p>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: '#64748B' }}
              formatter={(value) => value.replace('voie', 'Voie ')}
            />
            {VOIE_KEYS.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={VOIE_COLORS[key]}
                strokeWidth={2}
                dot={false}
                connectNulls
                isAnimationActive
                animationDuration={400}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
