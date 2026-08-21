import { ArrowLeft, User, Camera, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function ProfileEdit() {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const roleName = role === 'admin' ? 'Admin User' :
                   role === 'doctor' ? 'Dr. Sarah Smith' :
                   role === 'nurse' ? 'Nurse Jane Doe' :
                   role === 'receptionist' ? 'Alice Brown' :
                   'Lab Technician';

  return (
    <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="sticky top-0 z-30 bg-white pt-4 pb-3 px-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
              <User className="w-10 h-10" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input type="text" defaultValue={roleName} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" defaultValue="user@mediquee.com" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <input type="tel" defaultValue="+91 9876543210" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <button className="bg-blue-600 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mt-4">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
