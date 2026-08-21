import { User, Bell, Shield, Settings, LogOut, ChevronRight, Building2, Users, LayoutGrid, Key, HelpCircle, MessageSquare, Calendar, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { ConfirmationSheet } from "@/components/ui/ConfirmationSheet"

export function Profile() {
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const appLinks = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Shield, label: "Security & Privacy", path: "/security" },
    { icon: Settings, label: "App Settings", path: "/settings" },
  ];

  const supportLinks = [
    { icon: HelpCircle, label: "Help & Support", path: "/support" },
    { icon: MessageSquare, label: "Contact Support", path: "/contact" },
  ];

  let roleTitle = "Hospital Administrator";
  let roleName = "Admin User";
  let accountLinks: any[] = [];
  let operationLinks: any[] = [];

  if (role === 'admin') {
    accountLinks = [
      { icon: Building2, label: "Hospital Information", path: "/profile/hospital" },
    ];
    operationLinks = [
      { icon: Users, label: "Staff Management", path: "/profile/staff" },
      { icon: LayoutGrid, label: "Departments", path: "/profile/departments" },
      { icon: Key, label: "Permissions", path: "/profile/permissions" },
    ];
  } else if (role === 'doctor') {
    roleTitle = "Doctor";
    roleName = "Dr. User";
    accountLinks = [
      { icon: User, label: "Doctor Information", path: "/profile/edit" },
      { icon: LayoutGrid, label: "Specialization & Department", path: "/profile/specialization" },
      { icon: Calendar, label: "Consultation Availability", path: "/profile/availability" },
    ];
  } else if (role === 'nurse') {
    roleTitle = "Nurse";
    roleName = "Nurse User";
    accountLinks = [
      { icon: User, label: "Nurse Information", path: "/profile/edit" },
      { icon: LayoutGrid, label: "Service Area", path: "/profile/service-area" },
      { icon: Calendar, label: "Availability", path: "/profile/availability" },
    ];
  } else if (role === 'receptionist') {
    roleTitle = "Receptionist";
    roleName = "Receptionist User";
    accountLinks = [
      { icon: User, label: "Receptionist Information", path: "/profile/edit" },
      { icon: Building2, label: "Hospital & Department", path: "/profile/hospital" },
    ];
  } else if (role === 'lab') {
    roleTitle = "Laboratory";
    roleName = "Lab User";
    accountLinks = [
      { icon: Building2, label: "Laboratory Information", path: "/profile/edit" },
      { icon: LayoutGrid, label: "Test Catalog", path: "/profile/test-catalog" },
      { icon: Home, label: "Home Collection Settings", path: "/profile/home-collection" },
    ];
  }

  const renderSection = (title: string, links: any[]) => (
    <div className="flex flex-col gap-2 mb-6">
      <h3 className="text-[14px] font-semibold text-[#667085] px-1 uppercase tracking-wider">{title}</h3>
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {links.map((link, index) => (
          <motion.button 
            key={index}
            variants={item}
            onClick={() => navigate(link.path)} 
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 interactive-element active:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 text-[#667085] flex items-center justify-center shrink-0 border border-gray-100">
                <link.icon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[15px] text-[#172033]">{link.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#98A2B3]" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-background min-h-full pb-8">
      
      {/* Sticky Top Controls */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-4 pb-3 px-4 flex justify-between items-center border-b border-gray-100/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h1 className="text-[22px] font-semibold text-[#172033]">Profile</h1>
      </div>

      <div className="flex flex-col px-4 pt-5">
        
        {/* Profile Header */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile/edit')}
          className="w-full text-left bg-white rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-200/60 mb-6 flex items-center justify-between interactive-element active:bg-gray-50/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center border border-blue-100 shrink-0 overflow-hidden">
              <User className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#172033]">{roleName}</h2>
              <p className="text-[13px] font-medium text-[#667085]">user@mediquee.com</p>
              <div className="mt-1 flex items-center">
                <span className="bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-blue-100">
                  {roleTitle}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#98A2B3]" />
        </motion.button>

        {/* Menu Sections */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {renderSection("Account", accountLinks)}
          {operationLinks.length > 0 && renderSection("Operations", operationLinks)}
          {renderSection("App", appLinks)}
          {renderSection("Support", supportLinks)}
        </motion.div>

        {/* Logout */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-red-100 text-destructive rounded-2xl shadow-sm interactive-element active:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-[15px]">Logout</span>
        </motion.button>
      </div>

      <ConfirmationSheet 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Logout?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleLogout}
      />
    </div>
  )
}
