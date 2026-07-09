import { Gauge, LayoutDashboard, Cpu, AlertTriangle, BarChart3, Settings, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Devices', icon: Cpu },
  { label: 'Alerts', icon: AlertTriangle },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-brand-navy/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 transform bg-brand-navy text-white flex flex-col
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-brand-blue flex items-center justify-center">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm tracking-wide">TUNAV</p>
              <p className="text-[10px] text-brand-blue-light uppercase tracking-widest">IT Group</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 text-[11px] text-white/40">
          © {new Date().getFullYear()} TUNAV IT GROUP
        </div>
      </aside>
    </>
  )
}
