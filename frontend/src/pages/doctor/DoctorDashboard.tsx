import { motion } from "framer-motion"
import { Calendar, Video, Clock, Users, ArrowRight } from "lucide-react"

export function DoctorDashboard() {
  const stats = [
    { title: "Today's OPs", value: "24", icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "Video Consults", value: "8", icon: Video, color: "text-purple-600 bg-purple-50" },
    { title: "Pending", value: "12", icon: Clock, color: "text-orange-600 bg-orange-50" },
    { title: "Completed", value: "20", icon: Calendar, color: "text-green-600 bg-green-50" },
  ];

  const todayOPs = [
    { id: 1, name: "Rahul Sharma", time: "09:00 AM", type: "Follow up", status: "Waiting" },
    { id: 2, name: "Priya Singh", time: "09:30 AM", type: "New Patient", status: "In Progress" },
    { id: 3, name: "Amit Kumar", time: "10:00 AM", type: "Report Review", status: "Scheduled" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your schedule today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Today's OPs</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-4">
            {todayOPs.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{patient.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {patient.time} • {patient.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    patient.status === 'Waiting' ? 'bg-orange-100 text-orange-700' : 
                    patient.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {patient.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Video Consultations</h2>
            <button className="text-primary text-sm font-semibold hover:underline">Join Next</button>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No upcoming calls</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">You have no scheduled video consultations for the next hour.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
