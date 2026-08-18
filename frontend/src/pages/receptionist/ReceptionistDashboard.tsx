import { motion } from "framer-motion"
import { Users, UserPlus, Clock, ArrowRight, Building } from "lucide-react"

export function ReceptionistDashboard() {
  const stats = [
    { title: "Total Queue", value: "42", icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "Waiting", value: "15", icon: Clock, color: "text-orange-600 bg-orange-50" },
    { title: "New Registrations", value: "8", icon: UserPlus, color: "text-green-600 bg-green-50" },
  ];

  const departmentQueues = [
    { id: 1, name: "Cardiology", doctor: "Dr. Sharma", waiting: 5, status: "Normal" },
    { id: 2, name: "Orthopedics", doctor: "Dr. Verma", waiting: 12, status: "High Rush" },
    { id: 3, name: "Pediatrics", doctor: "Dr. Singh", waiting: 2, status: "Low" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage patient queues and hospital rush.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" /> New Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Department Queues (Live Rush)</h2>
            <button className="text-primary text-sm font-semibold hover:underline">Manage All</button>
          </div>
          <div className="flex flex-col gap-4">
            {departmentQueues.map(dept => (
              <div key={dept.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all gap-4 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{dept.name}</h4>
                    <p className="text-sm font-medium text-gray-500">{dept.doctor}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Waiting</span>
                    <span className="text-xl font-bold text-gray-900">{dept.waiting}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      dept.status === 'High Rush' ? 'bg-red-100 text-red-700' : 
                      dept.status === 'Normal' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
