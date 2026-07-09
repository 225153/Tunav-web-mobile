import { Menu, Bell } from 'lucide-react'
import ConnectionStatus from '../ui/ConnectionStatus.jsx'

export default function Header({ onMenuClick, connectionStatus }) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-brand-navy hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-brand-navy leading-tight">
            TUNAV IT GROUP Dashboard
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">Real-time telemetry overview</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <ConnectionStatus status={connectionStatus} />

        <button
          type="button"
          className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-brand-navy"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-blue-light" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-brand-blue flex items-center justify-center text-white text-sm font-semibold">
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
