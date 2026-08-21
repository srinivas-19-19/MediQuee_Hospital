import { Bell, MapPin, ChevronDown, LogOut } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function Header() {
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const isDashboard = ['/dashboard', '/', '/doctor', '/nurse', '/receptionist', '/lab'].includes(location.pathname);

  const getScreenName = () => {
    const path = location.pathname.substring(1);
    if (!path) return '';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const hideOnRoutes = ['/add-department', '/add-doctor', '/add-lab', '/add-nurse', '/add-receptionist'];
  if (hideOnRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  let greeting = "";
  let subTitle = "";

  if (role === 'admin') {
    greeting = "City Care Hospital";
    subTitle = "HOSPITAL";
  } else if (role === 'doctor') {
    greeting = "Dr. User Name";
    subTitle = "DOCTOR";
  } else if (role === 'nurse') {
    greeting = "Nurse User";
    subTitle = "NURSE";
  } else if (role === 'receptionist') {
    greeting = "Receptionist Name";
    subTitle = "RECEPTIONIST";
  } else if (role === 'lab') {
    greeting = "MediQuee Lab";
    subTitle = "LABORATORY";
  }

  return (
    <header className="bg-white px-4 pt-10 pb-3 z-40 flex flex-col gap-3 shrink-0 border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        {isDashboard ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="text-primary font-bold text-[20px] flex items-center tracking-tight">
                MediQuee
              </div>
              <div className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                {subTitle}
              </div>
            </div>
            <div className="text-[13px] text-[#172033] font-semibold ml-0.5 mt-0.5">
              {greeting}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full relative h-8">
            <h1 className="text-[17px] font-semibold text-[#172033]">{getScreenName()}</h1>
          </div>
        )}

        {isDashboard && (
          <div className="flex items-center gap-1">
            <button onClick={() => navigate('/notifications')} className="relative p-2 text-[#667085] hover:text-[#172033] transition-colors interactive-element">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('auth');
                localStorage.removeItem('role');
                window.location.href = '/MediQuee_Hospital/login';
              }} 
              className="p-2 -mr-2 text-[#667085] hover:text-red-500 transition-colors interactive-element"
            >
              <LogOut className="w-[22px] h-[22px]" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
