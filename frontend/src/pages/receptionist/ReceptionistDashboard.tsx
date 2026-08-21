import { motion } from "framer-motion"
import { UserPlus, Clock, ArrowRight, Building, CheckCircle2, Activity, PlaySquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ReceptionistDashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: "Waiting", value: "15", icon: Clock, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { title: "In Consultation", value: "8", icon: PlaySquare, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { title: "Completed", value: "42", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-100" },
  ];

  const departmentQueues = [
    { id: 'dept-1', name: "General Medicine", doctor: "Dr. Sharma", waiting: 12, inConsult: 3, nextOp: "OP-104", status: "HIGH" },
    { id: 'dept-2', name: "Cardiology", doctor: "Dr. Iyer", waiting: 6, inConsult: 2, nextOp: "OP-087", status: "MEDIUM" },
    { id: 'dept-3', name: "Pediatrics", doctor: "Dr. Singh", waiting: 2, inConsult: 1, nextOp: "OP-112", status: "LOW" },
  ];

  const overallRush = "HIGH"; // Example data based on queue

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 min-h-[calc(100vh-80px)]">
      
      {/* Header & Hospital Rush */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Hospital Rush</h2>
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${overallRush === 'HIGH' ? 'text-red-500' : overallRush === 'MEDIUM' ? 'text-orange-500' : 'text-green-500'}`} />
            <span className={`text-xl font-black ${overallRush === 'HIGH' ? 'text-red-600' : overallRush === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'}`}>
              {overallRush}
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/receptionist/check-in')}
          className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Check-In
        </button>
      </div>

      {/* Now Serving Prominent Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <PlaySquare className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col">
          <span className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">Now Serving</span>
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-5xl font-black tracking-tighter text-white">OP-103</h1>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-gray-100">Rahul Kumar</h3>
            <p className="text-sm font-medium text-gray-400">General Medicine • Dr. Sharma</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase">Next Up</span>
              <span className="text-white font-bold text-lg">OP-104</span>
            </div>
            <button onClick={() => navigate('/receptionist/queue')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md transition-colors">
              Manage Queue
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-3 rounded-2xl border ${stat.color.split(' ')[2]} shadow-sm flex flex-col items-center justify-center text-center gap-2`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${stat.color.split(' ').slice(0,2).join(' ')}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-black text-gray-900 leading-none">{stat.value}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Department Queues */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide">Department Queues</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {departmentQueues.map(dept => (
            <button 
              key={dept.id} 
              onClick={() => navigate(`/receptionist/queue?dept=${dept.id}`)}
              className="flex flex-col p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{dept.name}</h4>
                    <p className="text-xs font-medium text-gray-500">{dept.doctor}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${
                  dept.status === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 
                  dept.status === 'MEDIUM' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                  'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {dept.status} RUSH
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Waiting</span>
                    <span className="text-sm font-black text-gray-800">{dept.waiting}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">In Consult</span>
                    <span className="text-sm font-black text-gray-800">{dept.inConsult}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Next</span>
                    <span className="text-sm font-bold text-primary">{dept.nextOp}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
