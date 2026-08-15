import { NavLink, useLocation } from "react-router-dom"
import { LayoutGrid, Calendar, IndianRupee, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav({ onQuickAdd }: { onQuickAdd: () => void }) {
  const location = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-gray-200/50 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-6 pt-2 pb-2 h-[72px]">
        
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            cn("flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors interactive-element", 
            isActive ? "text-primary" : "text-[#98A2B3] hover:text-[#667085]")
          }
        >
          {({ isActive }) => (
            <>
              <LayoutGrid className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>Home</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/appointments" 
          className={({ isActive }) => 
            cn("flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors interactive-element", 
            isActive ? "text-primary" : "text-[#98A2B3] hover:text-[#667085]")
          }
        >
          {({ isActive }) => (
            <>
              <Calendar className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>Agenda</span>
            </>
          )}
        </NavLink>

        {/* FAB - Quick Add */}
        <div className="relative -top-7 px-2">
          <button 
            onClick={onQuickAdd}
            className="w-[56px] h-[56px] bg-primary text-white rounded-full shadow-[0_8px_16px_rgba(23,105,224,0.25)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all interactive-element">
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </div>

        <NavLink 
          to="/payouts" 
          className={({ isActive }) => 
            cn("flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors interactive-element", 
            isActive || location.pathname.includes('/payout') ? "text-primary" : "text-[#98A2B3] hover:text-[#667085]")
          }
        >
          {({ isActive }) => (
            <>
              <IndianRupee className="w-6 h-6" strokeWidth={isActive || location.pathname.includes('/payout') ? 2.5 : 2} />
              <span className={cn("text-[10px]", isActive || location.pathname.includes('/payout') ? "font-semibold" : "font-medium")}>Payout</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            cn("flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors interactive-element", 
            isActive ? "text-primary" : "text-[#98A2B3] hover:text-[#667085]")
          }
        >
          {({ isActive }) => (
            <>
              <User className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>Profile</span>
            </>
          )}
        </NavLink>

      </div>
    </div>
  )
}

