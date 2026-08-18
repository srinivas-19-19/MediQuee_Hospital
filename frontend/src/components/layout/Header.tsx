import { Bell, MapPin, ChevronDown } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function Header() {
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const displayRole = role === 'lab' ? 'Lab' : 'Hospital';
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  // Format screen name from pathname (e.g., "/patients" -> "Patients")
  const getScreenName = () => {
    const path = location.pathname.substring(1);
    if (!path) return '';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Hide header on form pages that have their own header
  const hideOnRoutes = ['/add-department', '/add-doctor', '/add-lab', '/add-nurse', '/add-receptionist'];
  if (hideOnRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <header className="bg-white px-4 pt-10 pb-3 z-40 flex flex-col gap-3 shrink-0 border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        {isDashboard ? (
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-[20px] flex items-center tracking-tight">
              MediQuee
            </div>
            <div className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">{displayRole}</div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full relative h-8">
            <h1 className="text-[17px] font-semibold text-[#172033]">{getScreenName()}</h1>
          </div>
        )}

        {isDashboard && (
          <button onClick={() => navigate('/notifications')} className="relative p-2 -mr-2 text-[#667085] hover:text-[#172033] transition-colors interactive-element">
            <Bell className="w-[22px] h-[22px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
          </button>
        )}
      </div>

      {isDashboard && (
        <button className="flex items-center justify-between w-full bg-[#F7F8FA] rounded-xl px-3 py-2.5 active:scale-[0.98] transition-transform interactive-element border border-gray-200/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-[18px] h-[18px] text-[#667085]" />
            <span className="font-semibold text-[14px] text-[#172033]">City Care Hospital</span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#98A2B3]" />
        </button>
      )}
    </header>
  )
}
