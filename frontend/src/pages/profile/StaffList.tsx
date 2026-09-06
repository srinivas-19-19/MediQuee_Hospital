import { ArrowLeft, Plus, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { EmptyState } from "@/components/ui/EmptyState"

export function StaffList() {
  const navigate = useNavigate();
  const { type } = useParams();

  const title = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Staff List";

  // Staff records come from the backend. Empty until connected.
  const staff: { id: string; name: string; designation: string; avatar?: string }[] = [];

  return (
    <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="sticky top-0 z-30 bg-white pt-4 pb-3 px-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          {staff.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Staff"
              description="Staff members will appear here once available."
            />
          ) : staff.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                {member.avatar
                  ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  : <Users className="w-5 h-5 text-gray-400" />
                }
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{member.name}</span>
                <span className="text-xs text-gray-500">{member.designation}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
