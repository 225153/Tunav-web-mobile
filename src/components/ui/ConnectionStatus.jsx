const STATUS_CONFIG = {
  connected: {
    label: 'Live',
    dotClass: 'bg-brand-blue-light pulse-live',
    textClass: 'text-brand-navy',
  },
  connecting: {
    label: 'Connecting…',
    dotClass: 'bg-amber-400',
    textClass: 'text-slate-500',
  },
  disconnected: {
    label: 'Offline',
    dotClass: 'bg-red-500',
    textClass: 'text-slate-500',
  },
}

export default function ConnectionStatus({ status = 'connecting' }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.connecting

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-50 border border-slate-200">
      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${config.dotClass}`} />
      <span className={`hidden sm:inline text-xs font-medium whitespace-nowrap ${config.textClass}`}>{config.label}</span>
    </div>
  )
}
