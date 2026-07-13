import { Menu, Bell } from 'lucide-react'
import ConnectionStatus from '../ui/ConnectionStatus.jsx'

export default function Header({ onMenuClick, connectionStatus }) {
  return (
    <header className="sticky top-0 z-20 h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 sm:-ml-2 rounded-md text-brand-navy hover:bg-slate-100 shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-brand-navy leading-tight truncate">
            <span className="sm:hidden">TUNAV Dashboard</span>
            <span className="hidden sm:inline">TUNAV IT GROUP Dashboard</span>
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">Real-time telemetry overview</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
        <ConnectionStatus status={connectionStatus} />

        <button
          type="button"
          className="relative p-1.5 sm:p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-brand-navy"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 h-2 w-2 rounded-full bg-brand-blue-light" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs sm:text-sm font-semibold shrink-0">
            AK
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-brand-navy">Amine Karray</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
