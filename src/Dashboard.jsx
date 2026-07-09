import { useEffect, useState, useCallback, useMemo } from 'react'
import { Cpu, AlertTriangle, ListChecks, Radio } from 'lucide-react'
import { supabase } from './supabaseClient.js'
import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import MetricCard from './components/ui/MetricCard.jsx'
import TelemetryChart from './components/charts/TelemetryChart.jsx'
import EventLogTable from './components/tables/EventLogTable.jsx'

const TABLE_NAME = 'mesures'
const HISTORY_LIMIT = 30
const LOG_LIMIT = 5

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [rows, setRows] = useState([]) // chronological (oldest -> newest), capped to HISTORY_LIMIT

  // ── Initial fetch ────────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    async function fetchInitialData() {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(HISTORY_LIMIT)

      if (error) {
        console.error('[Dashboard] Failed to fetch mesures:', error.message)
        return
      }

      if (isMounted && data) {
        setRows([...data].reverse()) // oldest first for the chart
      }
    }

    fetchInitialData()
    return () => {
      isMounted = false
    }
  }, [])

  // ── Realtime subscription ───────────────────────────────
  const handleInsert = useCallback((payload) => {
    setRows((prev) => {
      const next = [...prev, payload.new]
      return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next
    })
  }, [])

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
    const alertCount = rows.filter((r) => (r.alarmes || 0) > 0).length
    const avgVoie1 = rows.length > 0 
      ? (rows.reduce((acc, curr) => acc + (curr.voie1 || 0), 0) / rows.length).toFixed(1)
      : 0

    return {
      totalDevices: imeis.size,
      alerts: alertCount,
      average: avgVoie1,
    }
  }, [rows])

  const chartData = useMemo(
    () => rows.map((r) => ({ time: r.timestamp, value: r.voie1 })),
    [rows]
  )

  const logs = useMemo(() => {
    return [...rows].reverse().slice(0, LOG_LIMIT).map(r => ({
      id: r.id,
      created_at: r.timestamp,
      device_name: r.imei,
      status: (r.alarmes || 0) > 0 ? 'alert' : 'ok',
      message: `Voie1: ${r.voie1} / V2: ${r.voie2}`,
    }))
  }, [rows])

  return (
    <div className="min-h-screen flex bg-brand-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} connectionStatus={connectionStatus} />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard icon={Cpu} label="Total IMEI" value={metrics.totalDevices} accent="blue" />
            <MetricCard icon={AlertTriangle} label="Alarmes" value={metrics.alerts} accent="alert" />
            <MetricCard icon={ListChecks} label="Moyenne Voie 1" value={metrics.average} accent="navy" />
            <MetricCard icon={Radio} label="Mesures" value={rows.length} accent="light" suffix={`/ ${HISTORY_LIMIT}`} />
          </div>

          <TelemetryChart data={chartData} />

          <EventLogTable logs={logs} />
        </main>
      </div>
    </div>
  )
}
