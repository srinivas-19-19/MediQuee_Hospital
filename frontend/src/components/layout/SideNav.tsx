import { NavLink, useLocation } from "react-router-dom"
import { LayoutGrid, Calendar, IndianRupee, User, Plus, Video, Home, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function SideNav({ onQuickAdd }: { onQuickAdd: () => void }) {
  const location = useLocation()
  const { role } = useAuth()

  const displayName = role === 'lab' ? 'MediQuee Lab' : 'MediQuee Hospital';

  const getLinks = () => {
    switch (role) {
      case 'doctor':
        return [
          { to: '/doctor', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/appointments', icon: Calendar, label: "Today's OPs" },
          { to: '/video-consultations', icon: Video, label: 'Video Consults' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'nurse':
        return [
          { to: '/nurse', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/home-nursing', icon: Home, label: 'Home Nursing' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'receptionist':
        return [
          { to: '/receptionist', icon: LayoutGrid, label: 'Dashboard' },
          { to: '/receptionist/queue', icon: Users, label: 'Queue' },
          { to: '/patients', icon: User, label: 'Patients' },
          { to: '/appointments', icon: Calendar, label: 'Appointments' },
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
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-4 shrink-0 shadow-sm z-50">
      
      <div className="text-primary font-bold text-xl flex items-center gap-2 mb-8 px-4 pt-4">
        <span className="text-3xl">♥</span> {displayName}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => 
                cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium", 
                isActive || (link.to !== '/dashboard' && link.to !== '/doctor' && link.to !== '/nurse' && link.to !== '/receptionist' && location.pathname.includes(link.to)) ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50")
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Add Button (Admin Only) */}
      {role === 'admin' ? (
        <div className="mt-auto mb-4">
          <button 
            onClick={onQuickAdd}
            className="w-full bg-primary text-white p-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Quick Add</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}
