import { useEffect, useState, useCallback, useMemo } from 'react'
import { Cpu, AlertTriangle, ListChecks, Radio } from 'lucide-react'
import { supabase } from './supabaseClient.js'
import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import MetricCard from './components/ui/MetricCard.jsx'
import FilterBar from './components/ui/FilterBar.jsx'
import TelemetryChart from './components/charts/TelemetryChart.jsx'
import EventLogTable from './components/tables/EventLogTable.jsx'
import { VOIE_INDEXES, hasAnyAlarm, getActiveAlarmVoies } from './utils/vigi.js'

const TABLE_NAME = 'mesures'
const DEFAULT_LIMIT = 50

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [rows, setRows] = useState([]) // chronological (oldest -> newest), capped to `limit`
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [dateFilter, setDateFilter] = useState('') // '' = no filter, else 'yyyy-MM-dd'
  const [loading, setLoading] = useState(true)

  const isLiveView = dateFilter === '' || dateFilter === todayISO()

  // ── Fetch (initial + on filter change) ──────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (dateFilter) {
      const start = `${dateFilter}T00:00:00`
      const end = `${dateFilter}T23:59:59.999`
      query = query.gte('timestamp', start).lte('timestamp', end)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Dashboard] Failed to fetch mesures:', error.message)
      setLoading(false)
      return
    }

    setRows(data ? [...data].reverse() : []) // oldest first for the chart
    setLoading(false)
  }, [limit, dateFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Realtime subscription ───────────────────────────────
  const handleInsert = useCallback(
    (payload) => {
      // Only append live inserts while browsing today's data (not a past-date search).
      if (!isLiveView) return
      setRows((prev) => {
        const next = [...prev, payload.new]
        return next.length > limit ? next.slice(next.length - limit) : next
      })
    },
    [isLiveView, limit]
  )

  useEffect(() => {
    const channel = supabase
      .channel('mesures_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: TABLE_NAME },
        handleInsert
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('connected')
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setConnectionStatus('disconnected')
        else if (status === 'CLOSED') setConnectionStatus('disconnected')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [handleInsert])

  // ── Derived data ─────────────────────────────────────────
  const metrics = useMemo(() => {
    const imeis = new Set(rows.map((r) => r.imei).filter(Boolean))
    const alertCount = rows.filter((r) => hasAnyAlarm(r.alarmes)).length
    const latest = rows[rows.length - 1]
    const activeVoies = latest ? getActiveAlarmVoies(latest.alarmes) : []

    return {
      totalDevices: imeis.size,
      alerts: alertCount,
      lastAlarmVoies: activeVoies,
    }
  }, [rows])

  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        time: r.timestamp,
        voie1: r.voie1,
        voie2: r.voie2,
        voie3: r.voie3,
        voie4: r.voie4,
        voie5: r.voie5,
        voie6: r.voie6,
        voie7: r.voie7,
      })),
    [rows]
  )

  const logs = useMemo(() => [...rows].reverse(), [rows])

  const filterSubtitle = dateFilter
    ? `Mesures du ${new Date(`${dateFilter}T00:00:00`).toLocaleDateString()} — ${rows.length} sur ${limit} max`
    : `Dernières ${rows.length} mesures reçues`

  return (
    <div className="min-h-screen flex bg-brand-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} connectionStatus={connectionStatus} />

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4">
            <MetricCard icon={Cpu} label="Total IMEI" value={metrics.totalDevices} accent="blue" />
            <MetricCard icon={AlertTriangle} label="Mesures en alarme" value={metrics.alerts} accent="alert" />
            <MetricCard
              icon={ListChecks}
              label="Dernière alarme"
              value={metrics.lastAlarmVoies.length ? `V${metrics.lastAlarmVoies.join(', V')}` : 'Aucune'}
              accent={metrics.lastAlarmVoies.length ? 'alert' : 'navy'}
            />
            <MetricCard icon={Radio} label="Mesures" value={rows.length} accent="light" suffix={`/ ${limit}`} />
          </div>

          <FilterBar
            limit={limit}
            onLimitChange={setLimit}
            date={dateFilter}
            onDateChange={setDateFilter}
            onRefresh={fetchData}
            resultCount={rows.length}
          />

          <TelemetryChart data={chartData} />

          <EventLogTable
            logs={loading ? [] : logs}
            title="Historique des mesures"
            subtitle={filterSubtitle}
          />
        </main>
      </div>
    </div>
  )
}
