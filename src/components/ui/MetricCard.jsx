export default function MetricCard({ icon: Icon, label, value, accent = 'blue', suffix }) {
  const accentStyles = {
    blue: 'bg-brand-blue/10 text-brand-blue',
    light: 'bg-brand-blue-light/10 text-brand-blue-light',
    navy: 'bg-brand-navy/10 text-brand-navy',
    alert: 'bg-red-50 text-red-500',
  }[accent]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-brand-navy">
          {value}
          {suffix && <span className="ml-1 text-sm font-normal text-slate-400">{suffix}</span>}
        </p>
      </div>
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${accentStyles}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  )
}
