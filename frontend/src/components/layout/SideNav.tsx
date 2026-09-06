import { NavLink, useLocation } from "react-router-dom"
import { LayoutGrid, Calendar, IndianRupee, User, Plus, Video, Home, Users, Activity, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function SideNav({ 
  onQuickAdd,
  isOpen,
  onClose
}: { 
  onQuickAdd: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const location = useLocation()
  const { role } = useAuth()

  const displayName = role === 'lab' ? 'MediQuee Lab' : 'MediQuee Hospital';

  const getLinks = () => {
    switch (role) {
      case 'doctor':
        return [
          { to: '/doctor', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/appointments', icon: Calendar, label: "Today's OPs" },
          { to: '/video-consultations', icon: Video, label: 'Video Consults', badge: 'V2 Preview' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'nurse':
        return [
          { to: '/nurse', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/nurse/visits', icon: Home, label: 'Visits' },
          { to: '/nurse/calendar', icon: Calendar, label: 'Calendar' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'receptionist':
        return [
          { to: '/receptionist', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/receptionist/queue', icon: Users, label: 'Queue Management' },
          { to: '/receptionist/appointments', icon: Calendar, label: 'Appointments' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'admin':
      default:
        return [
          { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/appointments', icon: Calendar, label: 'Appointments' },
          { to: '/payouts', icon: IndianRupee, label: 'Payouts' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
    }
  }

  const links = getLinks();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#0A1A3D]/20 z-40 hidden md:block backdrop-blur-[2px] transition-opacity" 
          onClick={onClose}
        />
      )}
      <div className={cn(
        "hidden md:flex flex-col w-[280px] bg-white border-r border-gray-100 h-screen fixed top-0 left-0 p-4 shadow-2xl z-50 transition-transform duration-300 ease-[0.22,1,0.36,1]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        <div className="flex items-center justify-between mb-8 px-4 pt-4">
          <div className="text-[#0A1A3D] font-bold text-[22px] flex items-center gap-2 tracking-tight">
            <Activity className="w-8 h-8 text-[#1A56DB]" /> MediQuee
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-[#0A1A3D] transition-colors rounded-full hover:bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium relative", 
                isActive || (link.to !== '/dashboard' && link.to !== '/doctor' && link.to !== '/nurse' && link.to !== '/receptionist' && location.pathname.includes(link.to)) ? "bg-[#EBF5FF] text-[#1A56DB]" : "text-gray-600 hover:bg-gray-50 hover:text-[#0A1A3D]")
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.badge && (
                <span className="ml-auto bg-[#EBF5FF] text-[#1A56DB] text-[10px] font-bold px-2 py-0.5 rounded border border-[#1A56DB]/20">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Add Button (Admin Only) */}
      {role === 'admin' ? (
        <div className="mt-auto mb-4">
          <button 
            onClick={onQuickAdd}
            className="w-full bg-[#1A56DB] text-white p-4 rounded-xl shadow-[0_8px_16px_rgba(26,86,219,0.25)] flex items-center justify-center gap-2 hover:bg-[#0A1A3D] transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Quick Add</span>
          </button>
        </div>
      ) : null}
      </div>
    </>
  )
}
