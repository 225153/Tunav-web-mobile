export default function MetricCard({ icon: Icon, label, value, accent = 'blue', suffix }) {
  const accentStyles = {
    blue: 'bg-brand-blue/10 text-brand-blue',
    light: 'bg-brand-blue-light/10 text-brand-blue-light',
    navy: 'bg-brand-navy/10 text-brand-navy',
    alert: 'bg-red-50 text-red-500',
  }[accent]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-shadow min-w-0">
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide truncate">{label}</p>
        <p className="mt-1 sm:mt-1.5 text-lg sm:text-2xl font-semibold text-brand-navy truncate">
          {value}
          {suffix && <span className="ml-1 text-xs sm:text-sm font-normal text-slate-400">{suffix}</span>}
        </p>
      </div>
      <div className={`h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-lg flex items-center justify-center ${accentStyles}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
    </div>
  )
}
