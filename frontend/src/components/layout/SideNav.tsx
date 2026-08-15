import { NavLink, useLocation } from "react-router-dom"
import { LayoutGrid, Calendar, IndianRupee, User, Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function SideNav({ onQuickAdd }: { onQuickAdd: () => void }) {
  const location = useLocation()
  const { role } = useAuth()

  const displayName = role === 'lab' ? 'MediQuee Lab' : 'MediQuee Hospital';

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-4 shrink-0 shadow-sm z-50">
      
      <div className="text-primary font-bold text-xl flex items-center gap-2 mb-8 px-4 pt-4">
        <span className="text-3xl">♥</span> {displayName}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium", 
            isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50")
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/appointments" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium", 
            isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50")
          }
        >
          <Calendar className="w-5 h-5" />
          <span>Appointments</span>
        </NavLink>

        <NavLink 
          to="/payouts" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium", 
            isActive || location.pathname.includes('/payout') ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50")
          }
        >
          <IndianRupee className="w-5 h-5" />
          <span>Payouts</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium", 
            isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50")
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Quick Add Button */}
      <div className="mt-auto mb-4">
        <button 
          onClick={onQuickAdd}
          className="w-full bg-primary text-white p-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Quick Add</span>
        </button>
      </div>
    </div>
  )
}
